from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models.inventory import Item, Warehouse, StockLevel
from ..dependencies import require_role

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

# --- Items ---
@router.get("/items", response_model=list[Item])
def get_items(session: Session = Depends(get_session)):
    return session.exec(select(Item)).all()

@router.post("/items", response_model=Item)
def create_item(item: Item, session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

# --- Warehouses ---
@router.get("/warehouses", response_model=list[Warehouse])
def get_warehouses(session: Session = Depends(get_session)):
    return session.exec(select(Warehouse)).all()

@router.post("/warehouses", response_model=Warehouse)
def create_warehouse(warehouse: Warehouse, session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    session.add(warehouse)
    session.commit()
    session.refresh(warehouse)
    return warehouse