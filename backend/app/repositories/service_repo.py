from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.service_request import ServiceRequest
from app.repositories.base import BaseRepository

class ServiceRequestRepository(BaseRepository[ServiceRequest]):
    def get_by_status(self, db: Session, status: str, skip: int = 0, limit: int = 50) -> List[ServiceRequest]:
        return db.query(ServiceRequest)\
            .filter(ServiceRequest.status == status)\
            .order_by(ServiceRequest.created_at.desc())\
            .offset(skip).limit(limit).all()

service_repo = ServiceRequestRepository(ServiceRequest)
