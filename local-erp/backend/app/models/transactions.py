from typing import List, Optional
import datetime
from decimal import Decimal
from sqlmodel import Field, Relationship
from .base import BaseModel

# NOTE: Do NOT add `from __future__ import annotations` to this file.
# SQLModel 0.0.38 + SQLAlchemy 2.0 cannot resolve generic List["X"] relationships
# when annotations are lazily evaluated. Use string literals in quotes only.


# --- Master Data (Partners) ---
class Partner(BaseModel, table=True):
    """Unified table for Customers and Vendors"""
    name: str = Field(index=True)
    type: str = Field(max_length=20)  # CUSTOMER, VENDOR, BOTH
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tax_id: Optional[str] = None


# --- Sales ---
class SalesOrder(BaseModel, table=True):
    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    partner_id: str = Field(foreign_key="partner.id")
    status: str = Field(default="draft")  # draft, approved, shipped, closed, cancelled
    total_amount: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    notes: Optional[str] = None
    journal_entry_id: Optional[str] = Field(default=None, foreign_key="journalentry.id")

    lines: List["SalesOrderLine"] = Relationship(back_populates="sales_order")
    partner: Optional[Partner] = Relationship()


class SalesOrderLine(BaseModel, table=True):
    sales_order_id: str = Field(foreign_key="salesorder.id")
    item_id: str = Field(foreign_key="item.id")
    quantity: Decimal = Field(max_digits=10, decimal_places=2)
    unit_price: Decimal = Field(max_digits=10, decimal_places=2)
    discount: Decimal = Field(default=Decimal('0.00'), max_digits=10, decimal_places=2)
    total_price: Decimal = Field(max_digits=15, decimal_places=2)

    sales_order: Optional[SalesOrder] = Relationship(back_populates="lines")


class Invoice(BaseModel, table=True):
    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    due_date: Optional[datetime.date] = None
    partner_id: str = Field(foreign_key="partner.id")
    status: str = Field(default="draft")  # draft, open, paid, void
    amount_due: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    tax_amount: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    total_amount: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    memo: Optional[str] = None
    journal_entry_id: Optional[str] = Field(default=None, foreign_key="journalentry.id")

    lines: List["InvoiceLine"] = Relationship(back_populates="invoice")
    partner: Optional[Partner] = Relationship()


class InvoiceLine(BaseModel, table=True):
    invoice_id: str = Field(foreign_key="invoice.id")
    item_id: str = Field(foreign_key="item.id")
    quantity: Decimal = Field(max_digits=10, decimal_places=2)
    unit_price: Decimal = Field(max_digits=10, decimal_places=2)
    tax_rate: Decimal = Field(default=Decimal('0.00'), max_digits=5, decimal_places=2)
    total_price: Decimal = Field(max_digits=15, decimal_places=2)

    invoice: Optional[Invoice] = Relationship(back_populates="lines")


# --- Purchases ---
class PurchaseOrder(BaseModel, table=True):
    number: str = Field(unique=True, index=True)
    date: datetime.date = Field(default_factory=datetime.date.today)
    partner_id: str = Field(foreign_key="partner.id")
    status: str = Field(default="draft")  # draft, sent, received, closed, cancelled
    total_amount: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    notes: Optional[str] = None
    journal_entry_id: Optional[str] = Field(default=None, foreign_key="journalentry.id")

    lines: List["PurchaseOrderLine"] = Relationship(back_populates="purchase_order")
    partner: Optional[Partner] = Relationship()


class PurchaseOrderLine(BaseModel, table=True):
    purchase_order_id: str = Field(foreign_key="purchaseorder.id")
    item_id: str = Field(foreign_key="item.id")
    quantity: Decimal = Field(max_digits=10, decimal_places=2)
    unit_cost: Decimal = Field(max_digits=10, decimal_places=2)
    total_cost: Decimal = Field(max_digits=15, decimal_places=2)

    purchase_order: Optional[PurchaseOrder] = Relationship(back_populates="lines")