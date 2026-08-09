import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.database import engine, Base, SessionLocal
from app.models.admin import Admin
from app.models.category import Category
from app.core.security import hash_password
from app.routers import complaints, auth, categories, stats, chat

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed default admin
db = SessionLocal()
try:
    if not db.query(Admin).filter(Admin.email == "admin@citysync.gov").first():
        default_admin = Admin(email="admin@citysync.gov", password_hash=hash_password("admin1234"))
        db.add(default_admin)
        db.commit()

    # Seed default categories
    DEFAULT_CATEGORIES = [
        "Water", "Electricity", "Road", "Sanitation",
        "Environment", "Public Safety", "Noise", "Traffic",
        "Parks", "Housing", "Healthcare", "Education",
        "Transport", "Other"
    ]
    for cat_name in DEFAULT_CATEGORIES:
        if not db.query(Category).filter(Category.name == cat_name).first():
            db.add(Category(name=cat_name))
    db.commit()
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0"
)

# Rate Limiting configuration
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(categories.router)
app.include_router(stats.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AI Smart Civic Services API"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
