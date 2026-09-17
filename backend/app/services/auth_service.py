from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repo import user_repo
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import verify_password, create_access_token

class AuthService:
    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        user = user_repo.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def login_for_access_token(self, db: Session, email: str, password: str) -> dict:
        user = self.authenticate_user(db, email=email, password=password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user account")

        access_token = create_access_token(subject=user.email)
        return {"access_token": access_token, "token_type": "bearer"}

    def register_user(self, db: Session, user_in: UserCreate) -> User:
        existing = user_repo.get_by_email(db, email=user_in.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        return user_repo.create_user(db, user_in=user_in)

auth_service = AuthService()
