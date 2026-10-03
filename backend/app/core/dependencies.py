from typing import Tuple
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.db.models.user import User
from app.repositories.user_repository import UserRepository

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not credentials:
        raise UnauthorizedException("Authentication credentials were not provided")

    payload = decode_access_token(credentials.credentials)
    if not payload or "user_id" not in payload:
        raise UnauthorizedException("Invalid or expired authentication token")

    user_id = payload["user_id"]
    user = UserRepository.get_by_id(db, user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User account not found or inactive")

    return user


def require_patient(
    current_user: User = Depends(get_current_user)
) -> Tuple[User, int]:
    if current_user.role != "PATIENT":
        raise ForbiddenException("Access restricted to patient accounts")

    if not current_user.patient:
        raise ForbiddenException("No patient profile associated with this account")

    return current_user, current_user.patient.id


def require_doctor(
    current_user: User = Depends(get_current_user)
) -> Tuple[User, int]:
    if current_user.role not in ["DOCTOR", "RADIOLOGIST", "ADMIN"]:
        raise ForbiddenException("Access restricted to doctor accounts")

    if not current_user.doctor:
        raise ForbiddenException("No doctor profile associated with this account")

    return current_user, current_user.doctor.id
