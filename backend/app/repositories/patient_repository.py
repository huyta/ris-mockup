from typing import Any, List, Optional, Tuple
from sqlalchemy import or_, func
from sqlalchemy.orm import Session
from app.db.models.patient import Patient
from app.db.models.study import ImagingStudy
from app.db.models.assignment import StudyAssignment


class PatientRepository:
    @staticmethod
    def resolve_patient_id(db: Session, identifier: Any) -> Optional[int]:
        if identifier is None:
            return None
        if isinstance(identifier, int):
            return identifier
        ident_str = str(identifier).strip()
        if ident_str.isdigit():
            return int(ident_str)
        # Check by patient_number (e.g. P00010001)
        patient = db.query(Patient.id).filter(Patient.patient_number == ident_str).first()
        if patient:
            return patient[0]
        return None

    @staticmethod
    def get_by_id(db: Session, patient_id: Any) -> Optional[Patient]:
        resolved_id = PatientRepository.resolve_patient_id(db, patient_id)
        if resolved_id is None:
            return None
        return db.query(Patient).filter(Patient.id == resolved_id).first()


    @staticmethod
    def get_by_patient_number(db: Session, patient_number: str) -> Optional[Patient]:
        return db.query(Patient).filter(Patient.patient_number == patient_number).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[Patient]:
        return db.query(Patient).filter(Patient.user_id == user_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 20) -> Tuple[List[Patient], int]:
        query = db.query(Patient)
        total = query.count()
        patients = query.offset(skip).limit(limit).all()
        return patients, total

    @staticmethod
    def get_doctor_patients(
        db: Session,
        doctor_id: int,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Tuple[List[Patient], int]:
        # Only patients having at least one study assigned to doctor_id
        subquery = (
            db.query(ImagingStudy.patient_id)
            .join(StudyAssignment, StudyAssignment.study_id == ImagingStudy.id)
            .filter(StudyAssignment.doctor_id == doctor_id, StudyAssignment.is_active.is_(True))
        )

        if date_from:
            subquery = subquery.filter(ImagingStudy.study_date >= date_from)
        if date_to:
            subquery = subquery.filter(ImagingStudy.study_date <= date_to)

        subquery = subquery.distinct()

        query = db.query(Patient).filter(Patient.id.in_(subquery))

        if search:
            search_term = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    func.lower(Patient.first_name).like(search_term),
                    func.lower(Patient.last_name).like(search_term),
                    func.lower(Patient.first_name + " " + Patient.last_name).like(search_term),
                    func.lower(Patient.patient_number).like(search_term),
                    func.lower(Patient.email).like(search_term),
                    func.lower(Patient.phone).like(search_term)
                )
            )

        total = query.count()
        patients = query.order_by(Patient.last_name.asc(), Patient.first_name.asc()).offset(skip).limit(limit).all()
        return patients, total

    @staticmethod
    def has_doctor_access_to_patient(db: Session, doctor_id: int, patient_id: Any) -> bool:
        p_id = PatientRepository.resolve_patient_id(db, patient_id)
        if p_id is None:
            return False
        count = (
            db.query(ImagingStudy.id)
            .join(StudyAssignment, StudyAssignment.study_id == ImagingStudy.id)
            .filter(
                ImagingStudy.patient_id == p_id,
                StudyAssignment.doctor_id == doctor_id,
                StudyAssignment.is_active.is_(True)
            )
            .count()
        )
        return count > 0

