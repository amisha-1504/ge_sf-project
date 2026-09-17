from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.category import SubCategoryOut

class ProductImageOut(BaseModel):
    id: int
    image_path: str
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    in_stock: bool = True
    is_featured: bool = False

class ProductCreate(ProductBase):
    subcategory_id: int
    slug: str

class ProductUpdate(BaseModel):
    subcategory_id: Optional[int] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    in_stock: Optional[bool] = None
    is_featured: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    slug: str
    subcategory_id: int
    created_at: datetime
    subcategory: Optional[SubCategoryOut] = None
    images: List[ProductImageOut] = []

    model_config = ConfigDict(from_attributes=True)
