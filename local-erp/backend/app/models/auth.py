# auth.py
from sqlmodel import Field
from typing import Optional
from .base import BaseModel

class User(BaseModel, table=True):
    username: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    role: str = Field(default="staff") # admin, manager, staff
    is_active: bool = Field(default=True)