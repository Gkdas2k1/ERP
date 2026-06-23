from __future__ import annotations
from typing import Optional, List
from sqlmodel import Field, Relationship
from app.models.base import BaseModel

class Role(BaseModel, table=True):
    __tablename__ = "roles"

    name: str = Field(unique=True, index=True)
    description: Optional[str] = None
    
    # Relationships
    users: List["User"] = Relationship(back_populates="role")

class User(BaseModel, table=True):
    __tablename__ = "users"

    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)
    role_id: Optional[str] = Field(default=None, foreign_key="roles.id")
    
    # Relationships
    role: Optional[Role] = Relationship(back_populates="users")
