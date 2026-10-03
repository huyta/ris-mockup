from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class ImagingStudy(Base):
    __tablename__ = "imaging_studies"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    accession_number = Column(String(50), unique=True, index=True, nullable=False)
    study_date = Column(String(20), nullable=False, index=True)  # YYYY-MM-DD
    modality = Column(String(30), nullable=False, index=True)  # MRI, CT, X-Ray, etc.
    body_part = Column(String(100), nullable=False, index=True)
    study_description = Column(String(255), nullable=False)
    facility = Column(String(150), nullable=False)
    radiologist_name = Column(String(100), nullable=False)
    status = Column(String(30), nullable=False, index=True)  # SCHEDULED, IN_PROGRESS, REPORTED
    clinical_history = Column(Text, nullable=True)
    referring_doctor_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    patient = relationship("Patient", back_populates="studies")
    series = relationship("StudySeries", back_populates="study", cascade="all, delete-orphan", order_by="StudySeries.series_number")
    assignments = relationship("StudyAssignment", back_populates="study", cascade="all, delete-orphan")
    report = relationship("RadiologyReport", back_populates="study", uselist=False, cascade="all, delete-orphan")
