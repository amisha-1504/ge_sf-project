from typing import List, Optional
from fastapi import APIRouter, status, Query
from app.routes.deps import SessionDep, CurrentUserDep
from app.services.service_request_service import service_request_service
from app.schemas.service_request import ServiceRequestOut, ServiceRequestCreate, ServiceRequestUpdateStatus

router = APIRouter(prefix="/services", tags=["Service Requests"])

@router.post("/request", response_model=ServiceRequestOut, status_code=status.HTTP_201_CREATED)
def submit_service_request(db: SessionDep, req_in: ServiceRequestCreate):
    return service_request_service.create_request(db, req_in=req_in)

@router.get("/requests", response_model=List[ServiceRequestOut])
def list_service_requests(
    db: SessionDep,
    current_user: CurrentUserDep,
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = 0,
    limit: int = 50
):
    return service_request_service.list_requests(db, status=status_filter, skip=skip, limit=limit)

@router.patch("/requests/{req_id}", response_model=ServiceRequestOut)
def update_service_request_status(
    db: SessionDep,
    current_user: CurrentUserDep,
    req_id: int,
    status_in: ServiceRequestUpdateStatus
):
    return service_request_service.update_status(db, req_id=req_id, status_in=status_in)
