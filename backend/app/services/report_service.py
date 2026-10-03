from typing import Optional
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.db.models.report import RadiologyReport
from app.db.models.study import ImagingStudy
from app.repositories.report_repository import ReportRepository
from app.repositories.study_repository import StudyRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.report import RadiologyReportResponse


class ReportService:
    @staticmethod
    def _format_report_response(study: ImagingStudy, report: RadiologyReport) -> RadiologyReportResponse:
        patient = study.patient
        return RadiologyReportResponse(
            id=report.id,
            study_id=study.id,
            accession_number=report.accession_number,
            order_item_id=report.order_item_id,
            patient_id=patient.patient_number if patient else None,
            patient_name=patient.full_name if patient else None,
            patient_dob=patient.date_of_birth if patient else None,
            modality=study.modality,
            body_part=study.body_part,
            study_date=study.study_date,
            facility=study.facility,
            clinical_history=report.clinical_history,
            technique=report.technique,
            comparison=report.comparison,
            findings=report.findings,
            impression=report.impression,
            reported_by=report.reported_by,
            radiologist_title=report.radiologist_title,
            reported_date=report.reported_date,
            status=report.status
        )

    @staticmethod
    def get_patient_report(db: Session, patient_id: int, study_id: int, user_id: int) -> RadiologyReportResponse:
        study = StudyRepository.get_by_id(db, study_id)
        if not study or study.patient_id != patient_id:
            raise NotFoundException("Report not found")

        report = ReportRepository.get_by_study_id(db, study_id)
        if not report:
            raise NotFoundException("Report not available for this study")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="VIEW_REPORT",
            resource_type="REPORT",
            resource_id=str(report.id)
        )

        return ReportService._format_report_response(study, report)

    @staticmethod
    def get_doctor_report(db: Session, doctor_id: int, study_id: int, user_id: int) -> RadiologyReportResponse:
        study = StudyRepository.get_by_id(db, study_id)
        if not study or not StudyRepository.is_study_assigned_to_doctor(db, study_id, doctor_id):
            raise NotFoundException("Report not found")

        report = ReportRepository.get_by_study_id(db, study_id)
        if not report:
            raise NotFoundException("Report not available for this study")

        AuditRepository.create_log(
            db=db,
            user_id=user_id,
            action="VIEW_REPORT",
            resource_type="REPORT",
            resource_id=str(report.id)
        )

        return ReportService._format_report_response(study, report)
