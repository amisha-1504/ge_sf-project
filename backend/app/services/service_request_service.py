from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories.service_repo import service_repo
from app.models.service_request import ServiceRequest
from app.schemas.service_request import ServiceRequestCreate, ServiceRequestUpdateStatus

class ServiceRequestService:
    def create_request(self, db: Session, req_in: ServiceRequestCreate) -> ServiceRequest:
        return service_repo.create(db, obj_in=req_in)

    def update_status(self, db: Session, req_id: int, status_in: ServiceRequestUpdateStatus) -> ServiceRequest:
        req = service_repo.get(db, id=req_id)
        if not req:
            raise HTTPException(status_code=404, detail="Service request not found")
        return service_repo.update(db, db_obj=req, obj_in=status_in)

    def list_requests(self, db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[ServiceRequest]:
        if status:
            return service_repo.get_by_status(db, status=status, skip=skip, limit=limit)
        return service_repo.get_multi(db, skip=skip, limit=limit)

service_request_service = ServiceRequestService()
