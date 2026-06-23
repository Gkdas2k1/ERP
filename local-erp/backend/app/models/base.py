from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class BaseModel(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"onupdate": datetime.utcnow})
    is_active: bool = Field(default=True)