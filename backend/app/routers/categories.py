from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])

# ── Public: Get all active categories ───────────────────────────────────────
@router.get("/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.id).all()

# ── Admin: Add a new category ────────────────────────────────────────────────
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    existing = db.query(Category).filter(Category.name == category_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Category '{category_in.name}' already exists.")

    new_cat = Category(
        name=category_in.name
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

# ── Admin: Delete a category ──────────────────────────────────────────────────
@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    db.delete(cat)
    db.commit()
    return {"message": f"Category '{cat.name}' deleted successfully."}
