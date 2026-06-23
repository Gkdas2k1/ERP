from __future__ import annotations

from sqlmodel import Field, Relationship
from typing import List, Optional
from decimal import Decimal
from .base import BaseModel

class Item(BaseModel, table=True):
    sku: str = Field(unique=True, index=True)
    name: str
    category: str
    unit: str # e.g., PCS, KG, LTR
    standard_cost: Decimal = Field(default=Decimal('0.00'), max_digits=10, decimal_places=2)
    selling_price: Decimal = Field(default=Decimal('0.00'), max_digits=10, decimal_places=2)

class Warehouse(BaseModel, table=True):
    name: str
    location: str

class StockLevel(BaseModel, table=True):
    """Tracks quantity per item per warehouse"""
    item_id: str = Field(foreign_key="item.id")
    warehouse_id: str = Field(foreign_key="warehouse.id")
    quantity_on_hand: Decimal = Field(default=Decimal('0.00'), max_digits=10, decimal_places=2)
    reorder_level: Decimal = Field(default=Decimal('0.00'), max_digits=10, decimal_places=2)