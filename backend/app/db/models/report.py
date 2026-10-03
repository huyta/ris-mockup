from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class RadiologyReport(Base):
    __tablename__ = "radiology_reports"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("imaging_studies.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    accession_number = Column(String(50), nullable=False, index=True)
    order_item_id = Column(Integer, nullable=True)
    clinical_history = Column(Text, nullable=False)
    technique = Column(Text, nullable=False)
    comparison = Column(Text, nullable=True)
    findings = Column(Text, nullable=False)
    impression = Column(Text, nullable=False)
    reported_by = Column(String(100), nullable=False)
    radiologist_title = Column(String(150), nullable=True)
    reported_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    status = Column(String(20), nullable=False, default="FINAL")  # DRAFT, FINAL
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    study = relationship("ImagingStudy", back_populates="report")
