import os
import csv
from datetime import datetime
from app.models.database import SessionLocal, engine, Base
from app.models.complaint import Complaint
from app.models.admin import Admin
from app.models.category import Category
from app.data_science.generate_dataset import generate_dataset
from app.core.security import hash_password

def setup_and_load():
    # 1. Recreate DB
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 2. Seed Admin & Categories
    print("Seeding Admin & Categories...")
    default_admin = Admin(email="admin@smartcity.gov", password_hash=hash_password("admin1234"))
    db.add(default_admin)
    
    DEFAULT_CATEGORIES = [
        "Water", "Electricity", "Road", "Sanitation",
        "Environment", "Public Safety", "Noise", "Traffic",
        "Parks", "Housing", "Healthcare", "Education",
        "Transport", "Other", "Drainage", "Waste", "Safety"
    ]
    for cat_name in DEFAULT_CATEGORIES:
        if not db.query(Category).filter(Category.name == cat_name).first():
            db.add(Category(name=cat_name))
    
    db.commit()

    # 3. Generate Data
    print("Generating dataset...")
    generate_dataset(500)
    
    # 4. Load Data
    print("Loading dataset into DB...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.join(current_dir, "app", "data_science", "complaints_dataset.csv")
    
    with open(filepath, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        complaints_to_add = []
        for row in reader:
            db_complaint = Complaint(
                complaint_id=row['complaint_id'],
                category=row['category'],
                priority=row['priority'],
                ai_summary="Synthetic data generated for testing.",
                ai_confidence=0.95,
                date_submitted=datetime.strptime(row['date_submitted'], "%Y-%m-%d %H:%M:%S"),
                status=row['status'],
                resolution_days=int(row['resolution_days']) if row['resolution_days'] else None
            )
            # Use setters for encryption
            db_complaint.description = row['description']
            db_complaint.location = "City Area" # default location
            db_complaint.citizen_name = "Synthetic Citizen"
            db_complaint.citizen_email = "citizen@example.com"
            db_complaint.citizen_phone = ""
            
            complaints_to_add.append(db_complaint)
            
        db.add_all(complaints_to_add)
        db.commit()
    
    print("Successfully loaded 500 complaints into the database!")
    db.close()

if __name__ == "__main__":
    setup_and_load()
