from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import require_patient
from app.db.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.dashboard import PatientDashboardResponse
from app.schemas.study import (
    StudyListItemResponse,
    StudyDetailResponse,
    ViewerResponse
)
from app.schemas.report import RadiologyReportResponse
from app.services.patient_service import PatientService
from app.services.study_service import StudyService
from app.services.report_service import ReportService

router = APIRouter(prefix="/patient", tags=["Patient Portal"])


@router.get("/dashboard", response_model=PatientDashboardResponse)
def get_patient_dashboard(
    auth: tuple[User, int] = Depends(require_patient),
    db: Session = Depends(get_db)
):
    """
    Get patient dashboard statistics derived from authenticated patient session.
    """
    user, patient_id = auth
    return PatientService.get_dashboard(db, patient_id)


@router.get("/studies", response_model=PaginatedResponse[StudyListItemResponse])
def get_patient_studies(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    modality: Optional[str] = Query(None, description="Modality filter (MRI, CT, X-Ray, etc.)"),
    status: Optional[str] = Query(None, description="Status filter (SCHEDULED, IN_PROGRESS, REPORTED)"),
    body_part: Optional[str] = Query(None, description="Body part filter"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Keyword search"),
    sort_by: str = Query("study_date", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    auth: tuple[User, int] = Depends(require_patient),
    db: Session = Depends(get_db)
):
    """
    Get paginated studies belonging to the authenticated patient with server-side filters.
    """
    user, patient_id = auth
    filters = {
        "modality": modality,
        "status": status,
        "body_part": body_part,
        "date_from": date_from,
        "date_to": date_to,
        "search": search
    }

    items, total = StudyService.get_patient_studies(
        db=db,
        patient_id=patient_id,
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
def get_patient_study_detail(
    study_id: str,
    auth: tuple[User, int] = Depends(require_patient),
    db: Session = Depends(get_db)
):
    """
    Get full study details for the authenticated patient. Returns 404 if study does not belong to patient.
    """
    user, patient_id = auth
    return StudyService.get_patient_study_detail(db, patient_id, study_id, user.id)


@router.get("/studies/{study_id}/viewer", response_model=ViewerResponse)
def get_patient_study_viewer(
    study_id: str,
    auth: tuple[User, int] = Depends(require_patient),
    db: Session = Depends(get_db)
):
    """
    Get DICOM series and image metadata for the medical viewer.
    """
    user, patient_id = auth
    return StudyService.get_patient_viewer(db, patient_id, study_id, user.id)


@router.get("/studies/{study_id}/report", response_model=RadiologyReportResponse)
def get_patient_study_report(
    study_id: str,
    auth: tuple[User, int] = Depends(require_patient),
    db: Session = Depends(get_db)
):

    """
    Get formal radiology report for the study. Returns 404 if unowned or not reported yet.
    """
    user, patient_id = auth
    return ReportService.get_patient_report(db, patient_id, study_id, user.id)
