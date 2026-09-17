from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    subcategories: Mapped[List["SubCategory"]] = relationship(
        "SubCategory", back_populates="category", cascade="all, delete-orphan"
    )

class SubCategory(Base):
    __tablename__ = "subcategories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), index=True, nullable=False)

    category: Mapped["Category"] = relationship("Category", back_populates="subcategories")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="subcategory")
