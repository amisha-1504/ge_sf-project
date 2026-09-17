import os
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from app.repositories.product_repo import product_repo
from app.repositories.category_repo import subcategory_repo
from app.models.product import Product, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate
from app.core.config import settings

class ProductService:
    def create_product(self, db: Session, product_in: ProductCreate) -> Product:
        subcategory = subcategory_repo.get(db, id=product_in.subcategory_id)
        if not subcategory:
            raise HTTPException(status_code=404, detail="Subcategory not found")

        existing_slug = product_repo.get_by_slug(db, slug=product_in.slug)
        if existing_slug:
            raise HTTPException(status_code=400, detail="Product slug already exists")

        return product_repo.create(db, obj_in=product_in)

    def update_product(self, db: Session, product_id: int, product_in: ProductUpdate) -> Product:
        product = product_repo.get(db, id=product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product_in.subcategory_id:
            subcategory = subcategory_repo.get(db, id=product_in.subcategory_id)
            if not subcategory:
                raise HTTPException(status_code=404, detail="Subcategory not found")

        return product_repo.update(db, db_obj=product, obj_in=product_in)

    def delete_product(self, db: Session, product_id: int) -> bool:
        product = product_repo.get(db, id=product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product_repo.remove(db, id=product_id)
        return True

    def upload_product_image(self, db: Session, product_id: int, file: UploadFile, is_primary: bool = False) -> ProductImage:
        product = product_repo.get(db, id=product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        os.makedirs(settings.IMAGES_DIR, exist_ok=True)
        ext = os.path.splitext(file.filename)[1]
        filename = f"prod_{product_id}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(settings.IMAGES_DIR, filename)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        relative_path = f"/static/images/{filename}"
        return product_repo.add_image(db, product_id=product_id, image_path=relative_path, is_primary=is_primary)

product_service = ProductService()
