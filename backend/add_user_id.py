from app.models.database import engine
from sqlalchemy import text

with engine.connect() as con:
    try:
        con.execute(text("ALTER TABLE complaints ADD COLUMN user_id INTEGER NULL;"))
        con.commit()
        print("Column user_id added.")
    except Exception as e:
        print("Error or already exists:", e)
