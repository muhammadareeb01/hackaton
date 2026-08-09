import os
import sys
from sqlalchemy import text

# Add the parent directory of app to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models.database import engine

def drop_columns():
    with engine.connect() as conn:
        try:
            print("Dropping icon column...")
            conn.execute(text("ALTER TABLE categories DROP COLUMN icon;"))
        except Exception as e:
            print(f"Skipped or error: {e}")
            
        try:
            print("Dropping color column...")
            conn.execute(text("ALTER TABLE categories DROP COLUMN color;"))
        except Exception as e:
            print(f"Skipped or error: {e}")
            
        conn.commit()
        print("Schema update complete.")

if __name__ == "__main__":
    drop_columns()
