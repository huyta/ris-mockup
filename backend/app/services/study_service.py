from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.db.models.study import ImagingStudy
from app.db.models.series import StudySeries
from app.repositories.study_repository import StudyRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.study import (
    StudyListItemResponse,
    StudyDetailResponse,
    StudySeriesResponse,
    ViewerResponse
)
from app.services.viewer_service import ViewerService


class StudyService:
    @staticmethod
    def study_to_list_item(study: ImagingStudy) -> StudyListItemResponse:
        patient = study.patient
        assigned_doc_ids = [
            a.doctor.doctor_number for a in study.assignments if a.is_active and a.doctor
        ]

        return StudyListItemResponse(
            id=study.id,
            patient_id=study.patient_id,
            patient_number=patient.patient_number if patient else "",
            patient_name=patient.full_name if patient else "",
            patient_dob=patient.date_of_birth if patient else "",
            gender=patient.gender if patient else "",
            accession_number=study.accession_number,
            study_date=study.study_date,
            modality=study.modality,
            body_part=study.body_part,
            description=study.study_description,
            facility=study.facility,
            radiologist=study.radiologist_name,
            status=study.status,
            has_report=study.report is not None,
            report_id=study.report.id if study.report else None,
            referring_doctor_name=study.referring_doctor_name,
            assigned_doctor_ids=assigned_doc_ids
        )

    @staticmethod
    def series_to_response(series: StudySeries) -> StudySeriesResponse:
        image_urls = [img.image_url for img in series.images]
        return StudySeriesResponse(
            id=series.id,
            series_number=series.series_number,
            description=series.description,
            modality=series.modality,
            plane=series.plane,
            thumbnail_url=series.thumbnail_url,
            slice_thickness=series.slice_thickness,
            kvp=series.kvp,
            images=image_urls
        )

    @staticmethod
    def study_to_detail(study: ImagingStudy) -> StudyDetailResponse:
        list_item = StudyService.study_to_list_item(study)
        series_responses = [StudyService.series_to_response(s) for s in study.series]

        return StudyDetailResponse(
            **list_item.model_dump(),
            clinical_history=study.clinical_history,
            series=series_responses
        )

    @staticmethod
    def get_patient_studies(
        db: Session,
        patient_id: int,
        page: int = 1,
        page_size: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "study_date",
        sort_order: str = "desc"
    ) -> Tuple[List[StudyListItemResponse], int]:
        skip = (page - 1) * page_size
        studies, total = StudyRepository.get_patient_studies(
            db=db,
            patient_id=patient_id,
            skip=skip,
            limit=page_size,
            filters=filters,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return [StudyService.study_to_list_item(s) for s in studies], total

    @staticmethod
    def get_patient_study_detail(db: Session, patient_id: int, study_id: int, user_id: int) -> StudyDetailResponse:
        study = StudyRepository.get_by_id(db, study_id)
        # Enforce strict patient ownership
        if not study or study.patient_id != patient_id:
            raise NotFoundException("Study not found")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="VIEW_STUDY",
            resource_type="STUDY",
            resource_id=str(study_id)
        )

        return StudyService.study_to_detail(study)

    @staticmethod
    def get_patient_viewer(db: Session, patient_id: int, study_id: int, user_id: int) -> ViewerResponse:
        study = StudyRepository.get_by_id(db, study_id)
        if not study or study.patient_id != patient_id:
            raise NotFoundException("Study not found")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="OPEN_VIEWER",
            resource_type="STUDY",
            resource_id=str(study_id)
        )

        detail = StudyService.study_to_detail(study)
        viewer_session = ViewerService.get_viewer_session(study, user_id)

        return ViewerResponse(
            study=detail,
            series=detail.series,
            viewer=viewer_session
        )

    @staticmethod
    def get_doctor_studies(
        db: Session,
        doctor_id: int,
        page: int = 1,
        page_size: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "study_date",
        sort_order: str = "desc"
    ) -> Tuple[List[StudyListItemResponse], int]:
        skip = (page - 1) * page_size
        studies, total = StudyRepository.get_doctor_studies(
            db=db,
            doctor_id=doctor_id,
            skip=skip,
            limit=page_size,
            filters=filters,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return [StudyService.study_to_list_item(s) for s in studies], total

    @staticmethod
    def get_doctor_study_detail(db: Session, doctor_id: int, study_id: int, user_id: int) -> StudyDetailResponse:
        study = StudyRepository.get_by_id(db, study_id)
        # Check active assignment for this doctor
        if not study or not StudyRepository.is_study_assigned_to_doctor(db, study_id, doctor_id):
            raise NotFoundException("Study not found")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="VIEW_STUDY",
            resource_type="STUDY",
            resource_id=str(study_id)
        )

        return StudyService.study_to_detail(study)

    @staticmethod
    def get_doctor_viewer(db: Session, doctor_id: int, study_id: int, user_id: int) -> ViewerResponse:
        study = StudyRepository.get_by_id(db, study_id)
        if not study or not StudyRepository.is_study_assigned_to_doctor(db, study_id, doctor_id):
            raise NotFoundException("Study not found")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="OPEN_VIEWER",
            resource_type="STUDY",
            resource_id=str(study_id)
        )

        detail = StudyService.study_to_detail(study)
        viewer_session = ViewerService.get_viewer_session(study, user_id)

        return ViewerResponse(
            study=detail,
            series=detail.series,
            viewer=viewer_session
        )
