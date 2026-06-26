from sqlmodel import SQLModel, Field
from datetime import datetime
from .base import BaseModel

class AuditLog(BaseModel, table=True):
    """Immutable log of all system changes"""
    user_id: str = Field(foreign_key="user.id")
    action: str # CREATE, UPDATE, DELETE
    table_name: str
    record_id: str
    old_values: str = "" # JSON string of previous state
    new_values: str = "" # JSON string of new state
    timestamp: datetime = Field(default_factory=datetime.utcnow)