from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import random
from typing import List, Optional
import jwt
from pydantic import BaseModel

from app.models.database import get_db
from app.models.complaint import Complaint
from app.models.user import User
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintDetailResponse
from app.ai.predict import predict_complaint, get_estimated_resolution_days
from app.core.email import send_complaint_email
from app.core.config import settings

# Rate Limiter
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

def get_optional_user_id(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        from app.core.security import verify_firebase_token
        payload = verify_firebase_token(token)
        if not payload:
            return None
        return payload.get("user_id") or payload.get("sub")
    except Exception as e:
        print("Token error:", e)
        return None

def get_current_user_id(request: Request):
    user_id = get_optional_user_id(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated as user")
    return user_id

@router.post("/", response_model=ComplaintResponse)
@limiter.limit("5/minute")
def submit_complaint(complaint_in: ComplaintCreate, request: Request, db: Session = Depends(get_db)):
    """
    Registers a new civic complaint from a citizen.
    
    This endpoint intercepts the user's text description and runs it through our Machine Learning 
    models to automatically categorize the issue, assign a priority, and estimate resolution days 
    before saving it to the database. It also triggers a confirmation email notification.
    """
    user_id = get_optional_user_id(request)
    
    # 1. Run AI Analysis
    ai_result = predict_complaint(complaint_in.description, complaint_in.image_base64)
    
    # 2. Use user-selected category if provided, else use AI prediction
    final_category = complaint_in.category if complaint_in.category else ai_result.get("category", "Pending Review")
    
    # 3. Generate unique ID
    c_id = f"C{random.randint(10000, 99999)}"
    
    # 4. Create ORM object (uses setters to encrypt)
    db_complaint = Complaint(
        complaint_id=c_id,
        category=final_category,
        priority=ai_result.get("priority", "Medium"),
        ai_summary=ai_result.get("summary", "Needs manual review."),
        ai_confidence=ai_result.get("category_confidence", 0.0),
        user_id=user_id
    )
    
    db_complaint.description = complaint_in.description
    db_complaint.location = complaint_in.location
    db_complaint.citizen_phone = complaint_in.citizen_phone
    
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db_complaint.citizen_name = complaint_in.citizen_name or user.full_name
            db_complaint.citizen_email = complaint_in.citizen_email or user.email
    else:
        db_complaint.citizen_name = complaint_in.citizen_name
        db_complaint.citizen_email = complaint_in.citizen_email

    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    # Send email notification if email provided
    if db_complaint.citizen_email:
        send_complaint_email(db_complaint.citizen_email, db_complaint.complaint_id, "Registered")
    
    # 5. Return frontend format
    return {
        "id": db_complaint.complaint_id,
        "category": db_complaint.category,
        "priority": db_complaint.priority,
        "confidence": db_complaint.ai_confidence,
        "summary": db_complaint.ai_summary,
        "status": db_complaint.status,
        "citizen_name": db_complaint.citizen_name,
        "date_submitted": db_complaint.date_submitted,
        "estimated_resolution_days": ai_result.get("ai_report", {}).get("estimated_resolution_days")
    }

@router.get("/me", response_model=List[ComplaintResponse])
def get_my_complaints(request: Request, db: Session = Depends(get_db)):
    """
    Fetches all complaints submitted by the currently authenticated citizen.
    Requires a valid JWT/Firebase token in the Authorization header.
    """
    user_id = get_current_user_id(request)
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).order_by(Complaint.date_submitted.desc()).all()
    return [
        {
            "id": c.complaint_id,
            "category": c.category,
            "priority": c.priority,
            "confidence": c.ai_confidence,
            "summary": c.ai_summary,
            "status": c.status,
            "citizen_name": c.citizen_name,
            "date_submitted": c.date_submitted,
            "estimated_resolution_days": get_estimated_resolution_days(c.category, c.priority)
        } for c in complaints
    ]

@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Fetches a paginated list of all civic complaints.
    This is primarily used by the admin dashboard to populate the data tables and map views.
    """
    complaints = db.query(Complaint).order_by(Complaint.date_submitted.desc()).offset(skip).limit(limit).all()
    # Map to schema mapping
    return [
        {
            "id": c.complaint_id,
            "category": c.category,
            "priority": c.priority,
            "confidence": c.ai_confidence,
            "summary": c.ai_summary,
            "status": c.status,
            "citizen_name": c.citizen_name,
            "date_submitted": c.date_submitted,
            "estimated_resolution_days": get_estimated_resolution_days(c.category, c.priority)
        } for c in complaints
    ]

class StatusUpdate(BaseModel):
    status: str

@router.put("/{complaint_id}/status")
def update_status(complaint_id: str, status_update: StatusUpdate, db: Session = Depends(get_db)):
    """
    Updates the status of a specific complaint (e.g., 'Pending Review' -> 'In Progress').
    Automatically triggers an email notification to the citizen informing them of the status change.
    """
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    complaint.status = status_update.status
    db.commit()
    
    if complaint.citizen_email:
        try:
            send_complaint_email(complaint.citizen_email, complaint.complaint_id, status_update.status)
        except Exception as e:
            print(f"Failed to send email notification on status update: {e}")
        
    return {"message": "Status updated successfully", "status": complaint.status}
