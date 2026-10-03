from typing import Optional
from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token
from app.core.exceptions import UnauthorizedException
from app.db.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.auth import TokenResponse, UserInfo


class AuthService:
    @staticmethod
    def authenticate(db: Session, username: str, password: str) -> TokenResponse:
        user = UserRepository.get_by_username(db, username.strip())
        if not user or not user.is_active:
            raise UnauthorizedException("Invalid username or password")

        if not verify_password(password, user.password_hash):
            raise UnauthorizedException("Invalid username or password")

        # Extract patient or doctor profile
        patient_id = user.patient.id if user.patient else None
        patient_num = user.patient.patient_number if user.patient else None
        doctor_id = user.doctor.id if user.doctor else None
        doctor_num = user.doctor.doctor_number if user.doctor else None

        name = user.username
        facility = None
        specialty = None
        avatar_url = None

        if user.patient:
            name = user.patient.full_name
            facility = "SMG Medical Centre (Novena)"
            avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
        elif user.doctor:
            name = user.doctor.full_name
            facility = user.doctor.clinic
            specialty = user.doctor.specialty
            avatar_url = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"

        extra_claims = {
            "name": name,
            "patient_id": patient_id,
            "patient_number": patient_num,
            "doctor_id": doctor_id,
            "doctor_number": doctor_num
        }

        token = create_access_token(
            subject=user.username,
            user_id=user.id,
            role=user.role,
            extra_claims=extra_claims
        )

        AuditRepository.create_log(
            db=db,
            user_id=user.id,
            action="LOGIN",
            resource_type="USER",
            resource_id=str(user.id),
            metadata={"role": user.role}
        )

        user_info = UserInfo(
            id=user.id,
            username=user.username,
            email=user.email,
            name=name,
            role=user.role,
            patient_id=patient_id,
            patient_number=patient_num,
            doctor_id=doctor_id,
            doctor_number=doctor_num,
            facility=facility,
            specialty=specialty,
            avatar_url=avatar_url
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_info
        )

    @staticmethod
    def get_current_user_info(db: Session, user: User) -> UserInfo:
        patient_id = user.patient.id if user.patient else None
        patient_num = user.patient.patient_number if user.patient else None
        doctor_id = user.doctor.id if user.doctor else None
        doctor_num = user.doctor.doctor_number if user.doctor else None

        name = user.username
        facility = None
        specialty = None
        avatar_url = None

        if user.patient:
            name = user.patient.full_name
            facility = "SMG Medical Centre (Novena)"
            avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
        elif user.doctor:
            name = user.doctor.full_name
            facility = user.doctor.clinic
            specialty = user.doctor.specialty
            avatar_url = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"

        return UserInfo(
            id=user.id,
            username=user.username,
            email=user.email,
            name=name,
            role=user.role,
            patient_id=patient_id,
            patient_number=patient_num,
            doctor_id=doctor_id,
            doctor_number=doctor_num,
            facility=facility,
            specialty=specialty,
            avatar_url=avatar_url
        )
