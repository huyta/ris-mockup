from typing import Optional
from sqlalchemy.orm import Session
from app.db.models.report import RadiologyReport


class ReportRepository:
    @staticmethod
    def get_by_id(db: Session, report_id: int) -> Optional[RadiologyReport]:
        return db.query(RadiologyReport).filter(RadiologyReport.id == report_id).first()

    @staticmethod
    def get_by_study_id(db: Session, study_id: int) -> Optional[RadiologyReport]:
        return db.query(RadiologyReport).filter(RadiologyReport.study_id == study_id).first()

    @staticmethod
    def get_by_accession(db: Session, accession_number: str) -> Optional[RadiologyReport]:
        return db.query(RadiologyReport).filter(RadiologyReport.accession_number == accession_number).first()
