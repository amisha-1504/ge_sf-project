from typing import List, Optional
from fastapi import APIRouter, status, Query
from app.routes.deps import SessionDep, CurrentUserDep
from app.services.exchange_service import exchange_service
from app.schemas.exchange_request import ExchangeRequestOut, ExchangeRequestCreate, ExchangeRequestUpdateStatus

router = APIRouter(prefix="/exchanges", tags=["Exchange Program"])

@router.post("/request", response_model=ExchangeRequestOut, status_code=status.HTTP_201_CREATED)
def submit_exchange_request(db: SessionDep, req_in: ExchangeRequestCreate):
    return exchange_service.create_request(db, req_in=req_in)

@router.get("/requests", response_model=List[ExchangeRequestOut])
def list_exchange_requests(
    db: SessionDep,
    current_user: CurrentUserDep,
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = 0,
    limit: int = 50
):
    return exchange_service.list_requests(db, status=status_filter, skip=skip, limit=limit)

@router.patch("/requests/{req_id}", response_model=ExchangeRequestOut)
def update_exchange_request_status(
    db: SessionDep,
    current_user: CurrentUserDep,
    req_id: int,
    status_in: ExchangeRequestUpdateStatus
):
    return exchange_service.update_status_and_estimate(db, req_id=req_id, status_in=status_in)
