from typing import TYPE_CHECKING, List, Optional
from datetime import datetime
from decimal import Decimal
from sqlmodel import Field, Relationship
from .base import BaseModel

# NOTE: Do NOT add `from __future__ import annotations` to this file.
# SQLModel 0.0.38 + SQLAlchemy 2.0 cannot resolve generic List["X"] relationships
# when annotations are lazily evaluated. Use string literals in quotes only.


class Account(BaseModel, table=True):
    """Chart of Accounts"""
    code: str = Field(unique=True, index=True, max_length=20)
    name: str = Field(max_length=100)
    type: str = Field(max_length=20)  # ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    parent_id: Optional[str] = Field(default=None, foreign_key="account.id")

    # Relationships
    journal_lines: List["JournalEntryLine"] = Relationship(back_populates="account")


class JournalEntry(BaseModel, table=True):
    """The Header for a double-entry transaction"""
    date: datetime
    reference: str = Field(max_length=50, index=True)  # e.g., INV-001, BILL-002
    description: str
    is_posted: bool = Field(default=False)  # False = Draft, True = Posted (Immutable)

    # Relationships
    lines: List["JournalEntryLine"] = Relationship(back_populates="journal_entry")


class JournalEntryLine(BaseModel, table=True):
    """The Lines (Debits and Credits)"""
    journal_entry_id: str = Field(foreign_key="journalentry.id")
    account_id: str = Field(foreign_key="account.id")
    debit: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    credit: Decimal = Field(default=Decimal('0.00'), max_digits=15, decimal_places=2)
    description: Optional[str] = None

    # Relationships
    journal_entry: Optional[JournalEntry] = Relationship(back_populates="lines")
    account: Optional[Account] = Relationship(back_populates="journal_lines")