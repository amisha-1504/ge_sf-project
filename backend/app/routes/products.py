from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status, Query
from app.routes.deps import SessionDep, CurrentUserDep
from app.services.product_service import product_service
from app.repositories.product_repo import product_repo
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate, ProductImageOut

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def list_products(
    db: SessionDep,
    category_id: Optional[int] = Query(None),
    subcategory_id: Optional[int] = Query(None),
    q: Optional[str] = Query(None, description="Search products by title or description"),
    featured: Optional[bool] = Query(None),
    skip: int = 0,
    limit: int = 50
):
    return product_repo.filter_products(
        db,
        category_id=category_id,
        subcategory_id=subcategory_id,
        search_query=q,
        is_featured=featured,
        skip=skip,
        limit=limit
    )

@router.get("/{identifier}", response_model=ProductOut)
def get_product(db: SessionDep, identifier: str):
    if identifier.isdigit():
        prod = product_repo.get_detailed_by_id(db, product_id=int(identifier))
    else:
        prod = product_repo.get_by_slug(db, slug=identifier)

    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(db: SessionDep, current_user: CurrentUserDep, product_in: ProductCreate):
    return product_service.create_product(db, product_in=product_in)

@router.put("/{product_id}", response_model=ProductOut)
def update_product(db: SessionDep, current_user: CurrentUserDep, product_id: int, product_in: ProductUpdate):
    return product_service.update_product(db, product_id=product_id, product_in=product_in)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(db: SessionDep, current_user: CurrentUserDep, product_id: int):
    product_service.delete_product(db, product_id=product_id)
    return None

@router.post("/{product_id}/images", response_model=ProductImageOut, status_code=status.HTTP_201_CREATED)
def upload_image(
    db: SessionDep,
    current_user: CurrentUserDep,
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False)
):
    return product_service.upload_product_image(db, product_id=product_id, file=file, is_primary=is_primary)
