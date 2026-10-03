from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime

from app.db.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # VIEW_STUDY, VIEW_REPORT, OPEN_VIEWER, LOGIN, LOGOUT
    resource_type = Column(String(50), nullable=False)  # STUDY, REPORT, USER, PATIENT
    resource_id = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    metadata_json = Column(Text, nullable=True)
