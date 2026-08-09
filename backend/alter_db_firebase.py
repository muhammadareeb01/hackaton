from app.models.database import engine
from sqlalchemy import text

with engine.connect() as con:
    try:
        con.execute(text("ALTER TABLE complaints MODIFY COLUMN user_id VARCHAR(128) NULL;"))
        con.commit()
        print("Column user_id changed to VARCHAR.")
    except Exception as e:
        print("Error altering table:", e)
