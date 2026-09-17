from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Text, Numeric, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subcategory_id: Mapped[int] = mapped_column(Integer, ForeignKey("subcategories.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    dimensions: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    material: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    subcategory: Mapped["SubCategory"] = relationship("SubCategory", back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan"
    )

class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    image_path: Mapped[str] = mapped_column(String(255), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    product: Mapped["Product"] = relationship("Product", back_populates="images")
