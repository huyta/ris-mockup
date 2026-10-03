from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import require_doctor
from app.db.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.dashboard import DoctorDashboardResponse
from app.schemas.patient import PatientResponse
from app.schemas.doctor import DoctorPatientDetailResponse
from app.schemas.study import (
    StudyListItemResponse,
    StudyDetailResponse,
    ViewerResponse
)
from app.schemas.report import RadiologyReportResponse
from app.services.doctor_service import DoctorService
from app.services.study_service import StudyService
from app.services.report_service import ReportService

router = APIRouter(prefix="/doctor", tags=["Doctor Portal"])


@router.get("/dashboard", response_model=DoctorDashboardResponse)
def get_doctor_dashboard(
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get dashboard metrics for studies and patients assigned to the authenticated doctor.
    """
    user, doctor_id = auth
    return DoctorService.get_dashboard(db, doctor_id)


@router.get("/patients", response_model=PaginatedResponse[PatientResponse])
def get_doctor_patients(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by patient name, NRIC, phone or ID"),
    date_from: Optional[str] = Query(None, description="Filter patients with studies after this date"),
    date_to: Optional[str] = Query(None, description="Filter patients with studies before this date"),
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get patients who have at least one study assigned to the authenticated doctor.
    """
    user, doctor_id = auth
    items, total = DoctorService.get_patients(
        db=db,
        doctor_id=doctor_id,
        page=page,
        page_size=page_size,
        search=search,
        date_from=date_from,
        date_to=date_to
    )
    return PaginatedResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total
    )


@router.get("/patients/{patient_id}", response_model=DoctorPatientDetailResponse)
def get_doctor_patient_detail(
    patient_id: str,
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get detailed patient record and list of studies assigned to the doctor.
    Returns 404 if the doctor has no active assignments for this patient.
    """
    user, doctor_id = auth
    return DoctorService.get_patient_detail(db, doctor_id, patient_id)


@router.get("/studies", response_model=PaginatedResponse[StudyListItemResponse])
def get_doctor_studies(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    patient_id: Optional[str] = Query(None, description="Filter by Patient ID or Number"),
    patient_name: Optional[str] = Query(None, description="Filter by Patient Name"),
    accession_number: Optional[str] = Query(None, description="Filter by Accession Number"),
    modality: Optional[str] = Query(None, description="Modality filter (MRI, CT, X-Ray, etc.)"),
    body_part: Optional[str] = Query(None, description="Body part filter"),
    status: Optional[str] = Query(None, description="Status filter (SCHEDULED, IN_PROGRESS, REPORTED)"),
    date_from: Optional[str] = Query(None, description="Start study date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End study date (YYYY-MM-DD)"),
    referring_physician: Optional[str] = Query(None, description="Referring doctor name"),
    search: Optional[str] = Query(None, description="General keyword search"),
    sort_by: str = Query("study_date", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get studies assigned to the authenticated doctor with comprehensive filters.
    """
    user, doctor_id = auth
    filters = {
        "patient_id": patient_id,
        "patient_name": patient_name,
        "accession_number": accession_number,
        "modality": modality,
        "body_part": body_part,
        "status": status,
        "date_from": date_from,
        "date_to": date_to,
        "referring_physician": referring_physician,
        "search": search
    }

    items, total = StudyService.get_doctor_studies(
        db=db,
        doctor_id=doctor_id,
        page=page,
        page_size=page_size,
        filters=filters,
        sort_by=sort_by,
        sort_order=sort_order
    )

    return PaginatedResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total
    )


@router.get("/studies/{study_id}", response_model=StudyDetailResponse)
def get_doctor_study_detail(
    study_id: str,
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get full study details for an assigned study. Returns 404 if not assigned to the doctor.
    """
    user, doctor_id = auth
    return StudyService.get_doctor_study_detail(db, doctor_id, study_id, user.id)


@router.get("/studies/{study_id}/viewer", response_model=ViewerResponse)
def get_doctor_study_viewer(
    study_id: str,
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get DICOM series and image metadata for an assigned study.
    """
    user, doctor_id = auth
    return StudyService.get_doctor_viewer(db, doctor_id, study_id, user.id)


@router.get("/studies/{study_id}/report", response_model=RadiologyReportResponse)
def get_doctor_study_report(
    study_id: str,
    auth: tuple[User, int] = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Get radiology report for an assigned study.
    """
    user, doctor_id = auth
    return ReportService.get_doctor_report(db, doctor_id, study_id, user.id)

