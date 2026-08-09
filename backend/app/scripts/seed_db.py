import os
import sys
import pandas as pd
from datetime import datetime
import math

# Add the parent directory of app to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models.database import SessionLocal
from app.models.complaint import Complaint

def seed_database():
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data_science", "complaints_dataset.csv")
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return
        
    print(f"Reading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    db = SessionLocal()
    
    added_count = 0
    skipped_count = 0
    
    for _, row in df.iterrows():
        # Check if complaint already exists
        existing = db.query(Complaint).filter(Complaint.complaint_id == row['complaint_id']).first()
        if existing:
            skipped_count += 1
            continue
            
        # Parse date
        date_str = row['date_submitted']
        try:
            date_submitted = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        except:
            date_submitted = datetime.utcnow()
            
        # Handle nan for resolution_days
        res_days = None
        if pd.notna(row['resolution_days']):
            res_days = int(row['resolution_days'])
            
        # Create complaint object
        complaint = Complaint(
            complaint_id=row['complaint_id'],
            category=row['category'],
            priority=row['priority'],
            date_submitted=date_submitted,
            status=row['status'],
            resolution_days=res_days,
            ai_summary="Imported from historical dataset.",
            ai_confidence=100.0,
            assigned_department=f"{row['category']} Department" if pd.notna(row['category']) else None
        )
        
        # Use setters for encrypted fields
        complaint.description = str(row['description'])
        complaint.location = "Unknown (From Dataset)"
        complaint.citizen_name = "Anonymous Citizen"
        complaint.citizen_contact = "N/A"
        
        db.add(complaint)
        added_count += 1
        
    db.commit()
    db.close()
    
    print(f"Seeding complete! Added {added_count} records. Skipped {skipped_count} (already existed).")

if __name__ == "__main__":
    seed_database()
