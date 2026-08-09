from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.database import get_db
from app.models.complaint import Complaint
from app.core.security import get_current_admin

router = APIRouter(
    prefix="/api/stats",
    tags=["stats"]
)

@router.get("/")
def get_dashboard_stats(admin_user: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Total Complaints
    total = db.query(func.count(Complaint.id)).scalar() or 0
    
    # Open Issues
    open_issues = db.query(func.count(Complaint.id)).filter(Complaint.status != "Resolved").scalar() or 0
    
    # Resolved
    resolved = db.query(func.count(Complaint.id)).filter(Complaint.status == "Resolved").scalar() or 0
    
    # Categories
    categories_raw = db.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).all()
    categories = [{"name": c[0] or "Unknown", "count": c[1]} for c in categories_raw]
    
    # Priorities
    priorities_raw = db.query(Complaint.priority, func.count(Complaint.id)).group_by(Complaint.priority).all()
    priority_colors = {
        "Critical": "#dc2626",
        "High": "#ea580c",
        "Medium": "#eab308",
        "Low": "#16a34a"
    }
    priorities = [{"name": p[0] or "Unknown", "value": p[1], "color": priority_colors.get(p[0], "#64748b")} for p in priorities_raw]
    
    # Avg Resolution (Estimated)
    from app.ai.predict import get_estimated_resolution_days
    complaints = db.query(Complaint).all()
    total_est_days = 0
    valid_complaints = 0
    for c in complaints:
        est = get_estimated_resolution_days(c.category, c.priority)
        if est:
            total_est_days += est
            valid_complaints += 1
            
    avg_res = round(total_est_days / valid_complaints, 1) if valid_complaints > 0 else 4.2
    
    return {
        "total": total,
        "open_issues": open_issues,
        "resolved": resolved,
        "avg_resolution_time": f"{avg_res} Days", 
        "category_data": categories,
        "priority_data": priorities
    }
