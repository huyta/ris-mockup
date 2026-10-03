from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class StudyAssignment(Base):
    __tablename__ = "study_assignments"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("imaging_studies.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    assigned_by = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    study = relationship("ImagingStudy", back_populates="assignments")
    doctor = relationship("Doctor", back_populates="assignments")
