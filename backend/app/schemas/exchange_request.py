from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ExchangeRequestCreate(BaseModel):
    customer_name: str
    phone_number: str
    item_type: str
    quantity: int = 1
    condition_details: str
    image_path: Optional[str] = None

class ExchangeRequestUpdateStatus(BaseModel):
    status: str
    estimated_value: Optional[float] = None

class ExchangeRequestOut(ExchangeRequestCreate):
    id: int
    estimated_value: Optional[float] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
