from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.routes.deps import SessionDep, CurrentUserDep
from app.services.auth_service import auth_service
from app.schemas.token import Token
from app.schemas.user import UserOut, UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=Token)
def login(db: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    return auth_service.login_for_access_token(
        db, email=form_data.username, password=form_data.password
    )

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(db: SessionDep, user_in: UserCreate):
    return auth_service.register_user(db, user_in=user_in)

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: CurrentUserDep):
    return current_user
