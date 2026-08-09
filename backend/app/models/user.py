from sqlalchemy import Column, Integer, String
from app.models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(128), primary_key=True, index=True)
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
