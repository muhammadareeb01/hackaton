from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.database import get_db
from app.models.admin import Admin
from app.models.user import User
from app.schemas.admin import Token, LoginRequest
from app.core.security import verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings
import jwt
from app.ai.email_validator import is_disposable_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class EmailVerifyRequest(BaseModel):
    email: str

@router.post("/verify-email")
def verify_email(req: EmailVerifyRequest):
    """Checks if the email is disposable/spam using AI model."""
    if is_disposable_email(req.email):
        return {"allowed": False, "reason": "Disposable or spam emails are not allowed."}
    return {"allowed": True}

@router.post("/sync")
def sync_firebase_user(request: Request, db: Session = Depends(get_db)):
    """
    Synchronizes a new Firebase user into our local database.
    This is called right after a citizen registers or logs in via Firebase on the frontend,
    ensuring they have a corresponding record in the database for complaint tracking.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return {"status": "error", "message": "No token"}
    token = auth_header.split(" ")[1]
    
    try:
        from app.core.security import verify_firebase_token
        
        # Verify Firebase token with signature check
        payload = verify_firebase_token(token)
        if not payload:
            return {"status": "error", "message": "Invalid token signature"}
            
        user_id = payload.get("user_id") or payload.get("sub")
        email = payload.get("email", "")
        name = payload.get("name", "")
        
        if not user_id:
            return {"status": "error", "message": "No user ID in token"}
            
        # Check if user exists
        existing_user = db.query(User).filter(User.id == user_id).first()
        if not existing_user:
            new_user = User(id=user_id, email=email, full_name=name)
            db.add(new_user)
            db.commit()
            
        return {"status": "success"}
    except Exception as e:
        print("Sync error:", e)
        return {"status": "error", "message": str(e)}

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a municipal administrator.
    Verifies the email and hashed password against the database, and if successful, 
    returns a JWT Bearer token for secure admin dashboard access.
    """
    admin = db.query(Admin).filter(Admin.email == login_data.email).first()
    
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

