from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.category import Category, SubCategory
from app.repositories.base import BaseRepository

class CategoryRepository(BaseRepository[Category]):
    def get_by_slug(self, db: Session, slug: str) -> Optional[Category]:
        return db.query(Category).options(joinedload(Category.subcategories)).filter(Category.slug == slug).first()

    def get_all_with_subcategories(self, db: Session) -> List[Category]:
        return db.query(Category).options(joinedload(Category.subcategories)).all()

class SubCategoryRepository(BaseRepository[SubCategory]):
    def get_by_slug(self, db: Session, slug: str) -> Optional[SubCategory]:
        return db.query(SubCategory).filter(SubCategory.slug == slug).first()

category_repo = CategoryRepository(Category)
subcategory_repo = SubCategoryRepository(SubCategory)
