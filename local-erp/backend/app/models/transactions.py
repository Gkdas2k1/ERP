from __future__ import annotations
from typing import Optional
import datetime
from sqlmodel import Field
from app.models.base import BaseModel

class Invoice(BaseModel, table=True):
    __tablename__ = "invoices"

    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    due_date: Optional[datetime.date] = None
    customer_name: str = Field(index=True)
    status: str = Field(default="draft")  # draft, open, paid, void
    amount_due: float = Field(default=0.0)
    tax_amount: float = Field(default=0.0)
    total_amount: float = Field(default=0.0)
    memo: Optional[str] = None

class SalesOrder(BaseModel, table=True):
    __tablename__ = "sales_orders"

    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    customer_name: str = Field(index=True)
    status: str = Field(default="draft")  # draft, approved, shipped, closed, cancelled
    total_amount: float = Field(default=0.0)
    notes: Optional[str] = None

class PurchaseOrder(BaseModel, table=True):
    __tablename__ = "purchase_orders"

    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    vendor_name: str = Field(index=True)
    status: str = Field(default="draft")  # draft, sent, received, closed, cancelled
    total_amount: float = Field(default=0.0)
    notes: Optional[str] = None
