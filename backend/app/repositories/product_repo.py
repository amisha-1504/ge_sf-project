from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.product import Product, ProductImage
from app.repositories.base import BaseRepository

class ProductRepository(BaseRepository[Product]):
    def get_by_slug(self, db: Session, slug: str) -> Optional[Product]:
        return db.query(Product)\
            .options(joinedload(Product.subcategory), joinedload(Product.images))\
            .filter(Product.slug == slug).first()

    def get_detailed_by_id(self, db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product)\
            .options(joinedload(Product.subcategory), joinedload(Product.images))\
            .filter(Product.id == product_id).first()

    def filter_products(
        self,
        db: Session,
        category_id: Optional[int] = None,
        subcategory_id: Optional[int] = None,
        search_query: Optional[str] = None,
        is_featured: Optional[bool] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Product]:
        query = db.query(Product).options(joinedload(Product.subcategory), joinedload(Product.images))

        if subcategory_id:
            query = query.filter(Product.subcategory_id == subcategory_id)
        elif category_id:
            from app.models.category import SubCategory
            sub_ids = [s.id for s in db.query(SubCategory.id).filter(SubCategory.category_id == category_id).all()]
            query = query.filter(Product.subcategory_id.in_(sub_ids))

        if is_featured is not None:
            query = query.filter(Product.is_featured == is_featured)

        if search_query:
            term = f"%{search_query}%"
            query = query.filter(or_(Product.title.ilike(term), Product.description.ilike(term)))

        return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

    def add_image(self, db: Session, product_id: int, image_path: str, is_primary: bool = False) -> ProductImage:
        db_img = ProductImage(product_id=product_id, image_path=image_path, is_primary=is_primary)
        db.add(db_img)
        db.commit()
        db.refresh(db_img)
        return db_img

product_repo = ProductRepository(Product)
