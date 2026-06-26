from sqlmodel import Session
from ..models.audit import AuditLog
from datetime import datetime
import uuid
import json

def log_action(session: Session, user_id: str, action: str, table_name: str, record_id: str, old_values: dict = None, new_values: dict = None):
    """Helper function to save an audit log to the database"""
    log = AuditLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        action=action,
        table_name=table_name,
        record_id=record_id,
        old_values=json.dumps(old_values, default=str) if old_values else "",
        new_values=json.dumps(new_values, default=str) if new_values else "",
        timestamp=datetime.utcnow()
    )
    session.add(log)
    session.commit()