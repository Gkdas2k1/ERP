# settings.py
from sqlmodel import Field
from .base import BaseModel

class CompanySettings(BaseModel, table=True):
    """Singleton table for company branding and details"""
    company_name: str
    address: str
    tax_id: str
    logo_path: str = ""
    watermark_path: str = ""
    currency: str = Field(default="USD")