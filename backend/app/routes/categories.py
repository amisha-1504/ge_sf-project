from typing import List
from fastapi import APIRouter, HTTPException, status
from app.routes.deps import SessionDep, CurrentUserDep
from app.repositories.category_repo import category_repo, subcategory_repo
from app.schemas.category import CategoryOut, CategoryCreate, SubCategoryOut, SubCategoryCreate

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryOut])
def get_categories(db: SessionDep):
    return category_repo.get_all_with_subcategories(db)

@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(db: SessionDep, current_user: CurrentUserDep, category_in: CategoryCreate):
    existing = category_repo.get_by_slug(db, slug=category_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    return category_repo.create(db, obj_in=category_in)

@router.post("/subcategories", response_model=SubCategoryOut, status_code=status.HTTP_201_CREATED)
def create_subcategory(db: SessionDep, current_user: CurrentUserDep, sub_in: SubCategoryCreate):
    category = category_repo.get(db, id=sub_in.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Parent Category not found")
    return subcategory_repo.create(db, obj_in=sub_in)
