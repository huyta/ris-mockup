from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.repositories.patient_repository import PatientRepository
from app.repositories.study_repository import StudyRepository
from app.schemas.dashboard import PatientDashboardResponse
from app.schemas.patient import PatientResponse


class PatientService:
    @staticmethod
    def get_dashboard(db: Session, patient_id: int) -> PatientDashboardResponse:
        stats = StudyRepository.get_patient_dashboard_stats(db, patient_id)
        return PatientDashboardResponse(**stats)

    @staticmethod
    def get_profile(db: Session, patient_id: int) -> PatientResponse:
        patient = PatientRepository.get_by_id(db, patient_id)
        if not patient:
            raise NotFoundException("Patient not found")
        return PatientResponse.model_validate(patient)
