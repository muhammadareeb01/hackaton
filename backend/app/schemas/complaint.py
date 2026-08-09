from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ComplaintCreate(BaseModel):
    description: str = Field(..., min_length=10)
    location: str = Field(..., min_length=5)
    citizen_name: Optional[str] = None
    citizen_email: str = ""
    citizen_phone: str = ""
    image_base64: Optional[str] = None
    category: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str
    category: str
    priority: str
    confidence: float
    summary: str
    description: str
    status: str
    citizen_name: str
    date_submitted: datetime
    estimated_resolution_days: Optional[int] = None
    
    class Config:
        from_attributes = True

class ComplaintDetailResponse(ComplaintResponse):
    description: str
    location: str
    citizen_email: str
    citizen_phone: str
    assigned_department: Optional[str]
    resolution_days: Optional[int]
