from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ServiceRequestCreate(BaseModel):
    customer_name: str
    phone_number: str
    address: str
    service_type: str
    issue_description: str
    attached_image: Optional[str] = None

class ServiceRequestUpdateStatus(BaseModel):
    status: str

class ServiceRequestOut(ServiceRequestCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
