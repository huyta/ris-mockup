import json
from typing import Any, Dict, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.models.audit import AuditLog


class AuditRepository:
    @staticmethod
    def create_log(
        db: Session,
        user_id: Optional[int],
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        metadata_str = json.dumps(metadata) if metadata else None
        log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            timestamp=datetime.now(timezone.utc),
            metadata_json=metadata_str
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
