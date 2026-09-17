from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base import BaseRepository
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserRepository(BaseRepository[User]):
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create_user(self, db: Session, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            role=user_in.role,
            is_active=user_in.is_active,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

user_repo = UserRepository(User)
