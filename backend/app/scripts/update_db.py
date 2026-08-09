import os
import sys
from sqlalchemy import text

# Add the parent directory of app to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models.database import engine

def update_schema():
    with engine.connect() as conn:
        try:
            print("Adding citizen_email_encrypted...")
            conn.execute(text("ALTER TABLE complaints ADD COLUMN citizen_email_encrypted TEXT;"))
        except Exception as e:
            print(f"Skipped or error: {e}")
            
        try:
            print("Adding citizen_phone_encrypted...")
            conn.execute(text("ALTER TABLE complaints ADD COLUMN citizen_phone_encrypted TEXT;"))
        except Exception as e:
            print(f"Skipped or error: {e}")
            
        conn.commit()
        print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
