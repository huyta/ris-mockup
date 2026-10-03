from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models.doctor import Doctor


class DoctorRepository:
    @staticmethod
    def get_by_id(db: Session, doctor_id: int) -> Optional[Doctor]:
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()

    @staticmethod
    def get_by_doctor_number(db: Session, doctor_number: str) -> Optional[Doctor]:
        return db.query(Doctor).filter(Doctor.doctor_number == doctor_number).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[Doctor]:
        return db.query(Doctor).filter(Doctor.user_id == user_id).first()

    @staticmethod
    def get_all(db: Session) -> List[Doctor]:
        return db.query(Doctor).order_by(Doctor.first_name.asc()).all()
