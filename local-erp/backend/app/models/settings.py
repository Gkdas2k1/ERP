from sqlmodel import SQLModel, Field
from pydantic import BaseModel as PydanticBaseModel
from .base import BaseModel

# --- 1. The Request Model (What the frontend sends) ---
class CompanySettingsCreate(PydanticBaseModel):
    """Only includes fields the user needs to input"""
    company_name: str
    address: str
    tax_id: str
    logo_path: str = ""
    watermark_path: str = ""
    currency: str = "USD"

# --- 2. The Database Model (What gets saved to SQLite) ---
class CompanySettings(BaseModel, table=True):
    """Inherits id, created_at, updated_at, is_active from BaseModel"""
    company_name: str
    address: str
    tax_id: str
    logo_path: str = ""
    watermark_path: str = ""
    currency: str = Field(default="USD")