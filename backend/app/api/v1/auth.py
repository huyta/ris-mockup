from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.db.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserInfo
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with username and password. Returns JWT token and user profile.
    """
    return AuthService.authenticate(db, request.username, request.password)


@router.get("/me", response_model=UserInfo)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get profile information of currently authenticated user.
    """
    return AuthService.get_current_user_info(db, current_user)
