from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.exchange_request import ExchangeRequest
from app.repositories.base import BaseRepository

class ExchangeRequestRepository(BaseRepository[ExchangeRequest]):
    def get_by_status(self, db: Session, status: str, skip: int = 0, limit: int = 50) -> List[ExchangeRequest]:
        return db.query(ExchangeRequest)\
            .filter(ExchangeRequest.status == status)\
            .order_by(ExchangeRequest.created_at.desc())\
            .offset(skip).limit(limit).all()

exchange_repo = ExchangeRequestRepository(ExchangeRequest)
