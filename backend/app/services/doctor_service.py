from typing import Optional, Tuple, List
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.repositories.patient_repository import PatientRepository
from app.repositories.study_repository import StudyRepository
from app.schemas.dashboard import DoctorDashboardResponse
from app.schemas.patient import PatientResponse
from app.schemas.doctor import DoctorPatientDetailResponse
from app.services.study_service import StudyService


class DoctorService:
    @staticmethod
    def get_dashboard(db: Session, doctor_id: int) -> DoctorDashboardResponse:
        stats = StudyRepository.get_doctor_dashboard_stats(db, doctor_id)
        return DoctorDashboardResponse(**stats)

    @staticmethod
    def get_patients(
        db: Session,
        doctor_id: int,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Tuple[List[PatientResponse], int]:
        skip = (page - 1) * page_size
        patients, total = PatientRepository.get_doctor_patients(
            db=db,
            doctor_id=doctor_id,
            skip=skip,
            limit=page_size,
            search=search,
            date_from=date_from,
            date_to=date_to
        )
        return [PatientResponse.model_validate(p) for p in patients], total

    @staticmethod
    def get_patient_detail(db: Session, doctor_id: int, patient_id: int) -> DoctorPatientDetailResponse:
        # Check authorization: Doctor has active assignment for this patient
        if not PatientRepository.has_doctor_access_to_patient(db, doctor_id, patient_id):
            raise NotFoundException("Patient not found or not assigned to you")

        patient = PatientRepository.get_by_id(db, patient_id)
        if not patient:
            raise NotFoundException("Patient not found")

        # Get studies for this patient assigned to this doctor
        studies, total = StudyRepository.get_doctor_studies(
            db=db,
            doctor_id=doctor_id,
            skip=0,
            limit=100,
            filters={"patient_id": patient_id}
        )
        study_items = [StudyService.study_to_list_item(s) for s in studies]

        return DoctorPatientDetailResponse(
            patient=PatientResponse.model_validate(patient),
            study_count=len(study_items),
            studies=study_items
        )
