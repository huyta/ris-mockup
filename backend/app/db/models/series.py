from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class StudySeries(Base):
    __tablename__ = "study_series"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("imaging_studies.id", ondelete="CASCADE"), nullable=False, index=True)
    series_instance_uid = Column(String(100), unique=True, nullable=True)
    series_number = Column(Integer, nullable=False, default=1)
    description = Column(String(255), nullable=False)
    modality = Column(String(30), nullable=False)
    body_part = Column(String(100), nullable=True)
    plane = Column(String(30), nullable=False, default="Axial")  # Axial, Coronal, Sagittal, 3D, Scout
    thumbnail_url = Column(Text, nullable=True)
    slice_thickness = Column(String(50), nullable=True)
    kvp = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    study = relationship("ImagingStudy", back_populates="series")
    images = relationship("StudyImage", back_populates="series", cascade="all, delete-orphan", order_by="StudyImage.instance_number")


class StudyImage(Base):
    __tablename__ = "study_images"

    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("study_series.id", ondelete="CASCADE"), nullable=False, index=True)
    instance_number = Column(Integer, nullable=False, default=1)
    image_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    series = relationship("StudySeries", back_populates="images")
