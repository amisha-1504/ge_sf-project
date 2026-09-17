from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories.exchange_repo import exchange_repo
from app.models.exchange_request import ExchangeRequest
from app.schemas.exchange_request import ExchangeRequestCreate, ExchangeRequestUpdateStatus

class ExchangeService:
    def create_request(self, db: Session, req_in: ExchangeRequestCreate) -> ExchangeRequest:
        return exchange_repo.create(db, obj_in=req_in)

    def update_status_and_estimate(self, db: Session, req_id: int, status_in: ExchangeRequestUpdateStatus) -> ExchangeRequest:
        req = exchange_repo.get(db, id=req_id)
        if not req:
            raise HTTPException(status_code=404, detail="Exchange request not found")
        return exchange_repo.update(db, db_obj=req, obj_in=status_in)

    def list_requests(self, db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[ExchangeRequest]:
        if status:
            return exchange_repo.get_by_status(db, status=status, skip=skip, limit=limit)
        return exchange_repo.get_multi(db, skip=skip, limit=limit)

exchange_service = ExchangeService()
