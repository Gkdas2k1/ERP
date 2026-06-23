from __future__ import annotations
from typing import Optional
from sqlmodel import Field
from app.models.base import BaseModel

class CompanySettings(BaseModel, table=True):
    __tablename__ = "company_settings"

    company_name: str = Field(index=True)
    tax_id: Optional[str] = None
    currency: str = Field(default="USD")
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    theme: str = Field(default="dark")  # Premium dark mode by default
