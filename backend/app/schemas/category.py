from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class SubCategoryBase(BaseModel):
    name: str
    slug: str

class SubCategoryCreate(SubCategoryBase):
    category_id: int

class SubCategoryOut(SubCategoryBase):
    id: int
    category_id: int

    model_config = ConfigDict(from_attributes=True)

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    subcategories: List[SubCategoryOut] = []

    model_config = ConfigDict(from_attributes=True)
