from app.models.database import engine, Base
from app.models.user import User
import traceback

try:
    User.__table__.drop(engine, checkfirst=True)
    User.__table__.create(engine)
    print("Users table recreated successfully for Firebase.")
except Exception as e:
    print("Error:", e)
    traceback.print_exc()
