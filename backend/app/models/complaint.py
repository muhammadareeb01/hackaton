from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from .database import Base
from app.core.security import encrypt_field, decrypt_field

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String(50), unique=True, index=True)
    user_id = Column(String(128), nullable=True)
    
    
    # Encrypted fields
    description_encrypted = Column(Text, nullable=False)
    location_encrypted = Column(Text, nullable=False)
    citizen_name_encrypted = Column(Text, nullable=True)
    citizen_email_encrypted = Column(Text, nullable=True)
    citizen_phone_encrypted = Column(Text, nullable=True)
    
    # AI Fields
    category = Column(String(50))
    priority = Column(String(50))
    ai_summary = Column(Text)
    ai_confidence = Column(Float)
    
    # Metadata
    date_submitted = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="Pending Review")
    assigned_department = Column(String(100), nullable=True)
    resolution_days = Column(Integer, nullable=True)

    @property
    def citizen_name(self):
        return decrypt_field(self.citizen_name_encrypted) if self.citizen_name_encrypted else ""

    @citizen_name.setter
    def citizen_name(self, value):
        self.citizen_name_encrypted = encrypt_field(value)

    @property
    def citizen_email(self):
        return decrypt_field(self.citizen_email_encrypted) if self.citizen_email_encrypted else ""

    @citizen_email.setter
    def citizen_email(self, value):
        self.citizen_email_encrypted = encrypt_field(value)

    @property
    def citizen_phone(self):
        return decrypt_field(self.citizen_phone_encrypted) if self.citizen_phone_encrypted else ""

    @citizen_phone.setter
    def citizen_phone(self, value):
        self.citizen_phone_encrypted = encrypt_field(value)

    @property
    def description(self):
        return decrypt_field(self.description_encrypted)

    @description.setter
    def description(self, value):
        self.description_encrypted = encrypt_field(value)

    @property
    def location(self):
        return decrypt_field(self.location_encrypted)

    @location.setter
    def location(self, value):
        self.location_encrypted = encrypt_field(value)
