from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import or_, func, desc, asc
from sqlalchemy.orm import Session, joinedload
from app.db.models.study import ImagingStudy
from app.db.models.patient import Patient
from app.db.models.assignment import StudyAssignment
from app.db.models.report import RadiologyReport


class StudyRepository:
    @staticmethod
    def resolve_study_id(db: Session, identifier: Any) -> Optional[int]:
        if identifier is None:
            return None
        if isinstance(identifier, int):
            return identifier
        ident_str = str(identifier).strip()
        if ident_str.isdigit():
            return int(ident_str)
        if ident_str.startswith("STUDY-"):
            try:
                num = int(ident_str.split("-")[1])
                return num - 1000
            except ValueError:
                pass
        study = db.query(ImagingStudy.id).filter(ImagingStudy.accession_number == ident_str).first()
        if study:
            return study[0]
        return None

    @staticmethod
    def get_by_id(db: Session, study_id: Any) -> Optional[ImagingStudy]:
        resolved_id = StudyRepository.resolve_study_id(db, study_id)
        if resolved_id is None:
            return None
        return (
            db.query(ImagingStudy)
            .options(
                joinedload(ImagingStudy.patient),
                joinedload(ImagingStudy.series),
                joinedload(ImagingStudy.report),
                joinedload(ImagingStudy.assignments).joinedload(StudyAssignment.doctor)
            )
            .filter(ImagingStudy.id == resolved_id)
            .first()
        )


    @staticmethod
    def get_by_accession(db: Session, accession_number: str) -> Optional[ImagingStudy]:
        return (
            db.query(ImagingStudy)
            .options(
                joinedload(ImagingStudy.patient),
                joinedload(ImagingStudy.series),
                joinedload(ImagingStudy.report),
                joinedload(ImagingStudy.assignments).joinedload(StudyAssignment.doctor)
            )
            .filter(ImagingStudy.accession_number == accession_number)
            .first()
        )

    @staticmethod
    def is_study_assigned_to_doctor(db: Session, study_id: Any, doctor_id: int) -> bool:
        s_id = StudyRepository.resolve_study_id(db, study_id)
        if s_id is None:
            return False
        count = (
            db.query(StudyAssignment)
            .filter(
                StudyAssignment.study_id == s_id,
                StudyAssignment.doctor_id == doctor_id,
                StudyAssignment.is_active.is_(True)
            )
            .count()
        )
        return count > 0


    @staticmethod
    def get_patient_studies(
        db: Session,
        patient_id: int,
        skip: int = 0,
        limit: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "study_date",
        sort_order: str = "desc"
    ) -> Tuple[List[ImagingStudy], int]:
        query = (
            db.query(ImagingStudy)
            .options(
                joinedload(ImagingStudy.patient),
                joinedload(ImagingStudy.report),
                joinedload(ImagingStudy.assignments).joinedload(StudyAssignment.doctor)
            )
            .filter(ImagingStudy.patient_id == patient_id)
        )

        query = StudyRepository._apply_filters(query, filters)
        total = query.count()

        query = StudyRepository._apply_sorting(query, sort_by, sort_order)
        studies = query.offset(skip).limit(limit).all()
        return studies, total

    @staticmethod
    def get_doctor_studies(
        db: Session,
        doctor_id: int,
        skip: int = 0,
        limit: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "study_date",
        sort_order: str = "desc"
    ) -> Tuple[List[ImagingStudy], int]:
        # Filter strictly by study_assignments for this doctor
        query = (
            db.query(ImagingStudy)
            .join(StudyAssignment, StudyAssignment.study_id == ImagingStudy.id)
            .options(
                joinedload(ImagingStudy.patient),
                joinedload(ImagingStudy.report),
                joinedload(ImagingStudy.assignments).joinedload(StudyAssignment.doctor)
            )
            .filter(
                StudyAssignment.doctor_id == doctor_id,
                StudyAssignment.is_active.is_(True)
            )
        )

        query = StudyRepository._apply_filters(query, filters)
        total = query.count()

        query = StudyRepository._apply_sorting(query, sort_by, sort_order)
        studies = query.offset(skip).limit(limit).all()
        return studies, total

    @staticmethod
    def get_patient_dashboard_stats(db: Session, patient_id: int) -> Dict[str, Any]:
        studies = db.query(ImagingStudy).filter(ImagingStudy.patient_id == patient_id).all()
        total_studies = len(studies)

        # Reports available
        reports_available = sum(1 for s in studies if s.status == "REPORTED")

        # Recent studies (e.g. from the past 90 days or reported recently)
        recent_studies = sum(1 for s in studies if s.status in ["REPORTED", "IN_PROGRESS"])

        latest_study = (
            db.query(ImagingStudy.study_date)
            .filter(ImagingStudy.patient_id == patient_id)
            .order_by(ImagingStudy.study_date.desc())
            .first()
        )
        latest_date = latest_study[0] if latest_study else None

        return {
            "total_studies": total_studies,
            "recent_studies": recent_studies,
            "reports_available": reports_available,
            "latest_study_date": latest_date
        }

    @staticmethod
    def get_doctor_dashboard_stats(db: Session, doctor_id: int) -> Dict[str, Any]:
        assigned_studies_query = (
            db.query(ImagingStudy)
            .join(StudyAssignment, StudyAssignment.study_id == ImagingStudy.id)
            .filter(
                StudyAssignment.doctor_id == doctor_id,
                StudyAssignment.is_active.is_(True)
            )
        )

        # Unique patients
        assigned_patients = (
            assigned_studies_query
            .with_entities(ImagingStudy.patient_id)
            .distinct()
            .count()
        )

        # New / In progress studies
        new_studies = (
            assigned_studies_query
            .filter(ImagingStudy.status.in_(["IN_PROGRESS", "SCHEDULED"]))
            .count()
        )

        # Reports available
        reports_available = (
            assigned_studies_query
            .filter(ImagingStudy.status == "REPORTED")
            .count()
        )

        return {
            "assigned_patients": assigned_patients,
            "new_studies": new_studies,
            "reports_available": reports_available
        }

    @staticmethod
    def _apply_filters(query, filters: Optional[Dict[str, Any]]):
        if not filters:
            return query

        if filters.get("modality") and filters["modality"].upper() not in ["ALL", ""]:
            query = query.filter(func.upper(ImagingStudy.modality) == filters["modality"].upper())

        if filters.get("status") and filters["status"].upper() not in ["ALL", ""]:
            query = query.filter(func.upper(ImagingStudy.status) == filters["status"].upper())

        if filters.get("body_part") and filters["body_part"].upper() not in ["ALL", ""]:
            query = query.filter(func.lower(ImagingStudy.body_part).like(f"%{filters['body_part'].lower()}%"))

        if filters.get("date_from"):
            query = query.filter(ImagingStudy.study_date >= filters["date_from"])

        if filters.get("date_to"):
            query = query.filter(ImagingStudy.study_date <= filters["date_to"])

        if filters.get("patient_id"):
            query = query.join(ImagingStudy.patient).filter(
                or_(
                    ImagingStudy.patient_id == filters["patient_id"],
                    func.lower(Patient.patient_number).like(f"%{str(filters['patient_id']).lower()}%")
                )
            )

        if filters.get("patient_name"):
            query = query.join(ImagingStudy.patient).filter(
                or_(
                    func.lower(Patient.first_name).like(f"%{filters['patient_name'].lower()}%"),
                    func.lower(Patient.last_name).like(f"%{filters['patient_name'].lower()}%"),
                    func.lower(Patient.first_name + " " + Patient.last_name).like(f"%{filters['patient_name'].lower()}%")
                )
            )

        if filters.get("accession_number"):
            query = query.filter(func.lower(ImagingStudy.accession_number).like(f"%{filters['accession_number'].lower()}%"))

        if filters.get("referring_physician"):
            query = query.filter(func.lower(ImagingStudy.referring_doctor_name).like(f"%{filters['referring_physician'].lower()}%"))

        if filters.get("search"):
            search_term = f"%{filters['search'].lower()}%"
            query = query.outerjoin(ImagingStudy.patient).filter(
                or_(
                    func.lower(ImagingStudy.accession_number).like(search_term),
                    func.lower(ImagingStudy.study_description).like(search_term),
                    func.lower(ImagingStudy.body_part).like(search_term),
                    func.lower(ImagingStudy.modality).like(search_term),
                    func.lower(Patient.first_name).like(search_term),
                    func.lower(Patient.last_name).like(search_term),
                    func.lower(Patient.patient_number).like(search_term)
                )
            )

        return query

    @staticmethod
    def _apply_sorting(query, sort_by: str, sort_order: str):
        order_fn = desc if sort_order.lower() == "desc" else asc

        if sort_by == "study_date":
            return query.order_by(order_fn(ImagingStudy.study_date), desc(ImagingStudy.id))
        elif sort_by == "modality":
            return query.order_by(order_fn(ImagingStudy.modality))
        elif sort_by == "accession_number":
            return query.order_by(order_fn(ImagingStudy.accession_number))
        elif sort_by == "status":
            return query.order_by(order_fn(ImagingStudy.status))
        elif sort_by == "patient_name":
            return query.join(ImagingStudy.patient).order_by(order_fn(Patient.last_name), order_fn(Patient.first_name))
        else:
            return query.order_by(desc(ImagingStudy.study_date), desc(ImagingStudy.id))
