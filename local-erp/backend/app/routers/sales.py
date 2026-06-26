from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List
from decimal import Decimal
import datetime
from pathlib import Path

from ..database import get_session
from ..models.transactions import Invoice, InvoiceLine, Partner
from ..models.inventory import StockLevel, Item
from ..models.settings import CompanySettings
from ..dependencies import require_role
from fpdf import FPDF

# --- 1. Pydantic Schemas for Clean Input ---
class InvoiceLineCreate(BaseModel):
    item_id: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal('0.00')
    total_price: Decimal

class InvoiceCreate(BaseModel):
    number: str
    date: datetime.date
    partner_id: str
    status: str = "draft"
    amount_due: Decimal = Decimal('0.00')
    tax_amount: Decimal = Decimal('0.00')
    total_amount: Decimal = Decimal('0.00')
    memo: str = None
    lines: List[InvoiceLineCreate]

router = APIRouter(prefix="/api/sales", tags=["Sales & Invoicing"])

@router.get("/invoices", response_model=list[Invoice])
def get_invoices(session: Session = Depends(get_session)):
    return session.exec(select(Invoice)).all()

# --- 2. Updated Invoice Creation Logic ---
@router.post("/invoices", response_model=Invoice)
def create_invoice(invoice_data: InvoiceCreate, session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    # 1. Create the Invoice header first
    new_invoice = Invoice(
        number=invoice_data.number,
        date=invoice_data.date,
        partner_id=invoice_data.partner_id,
        status=invoice_data.status,
        amount_due=invoice_data.amount_due,
        tax_amount=invoice_data.tax_amount,
        total_amount=invoice_data.total_amount,
        memo=invoice_data.memo
    )
    session.add(new_invoice)
    session.commit()
    session.refresh(new_invoice)
    
    # 2. Create the Invoice Lines and deduct stock
    for line_data in invoice_data.lines:
        new_line = InvoiceLine(
            invoice_id=new_invoice.id,
            item_id=line_data.item_id,
            quantity=line_data.quantity,
            unit_price=line_data.unit_price,
            tax_rate=line_data.tax_rate,
            total_price=line_data.total_price
        )
        session.add(new_line)
        
        # Deduct Stock
        stock = session.exec(select(StockLevel).where(StockLevel.item_id == line_data.item_id)).first()
        if stock:
            stock.quantity_on_hand -= line_data.quantity
            session.add(stock)
            
    session.commit()
    session.refresh(new_invoice)
    return new_invoice

# --- 3. PDF Generation ---
@router.get("/invoices/{invoice_id}/pdf")
def generate_invoice_pdf(invoice_id: str, session: Session = Depends(get_session)):
    invoice = session.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    settings = session.exec(select(CompanySettings)).first()
    partner = session.get(Partner, invoice.partner_id)
    lines = session.exec(select(InvoiceLine).where(InvoiceLine.invoice_id == invoice_id)).all()

    pdf = FPDF()
    pdf.add_page()
    
    # Header / Logo
    if settings and settings.logo_path:
        # Safely resolve the absolute path to the logo
        base_dir = Path(__file__).resolve().parent.parent # Points to backend/app
        local_logo = base_dir / settings.logo_path.lstrip("/")
        
        if local_logo.exists():
            pdf.image(str(local_logo), x=10, y=8, w=40)
            
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_xy(60, 10)
    pdf.cell(0, 10, settings.company_name if settings else "Company", ln=True)
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_xy(60, 20)
    pdf.cell(0, 5, settings.address if settings else "", ln=True)
    
    # Invoice Details
    pdf.set_y(40)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, f"Invoice #: {invoice.number}", ln=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, f"Date: {invoice.date}", ln=True)
    pdf.cell(0, 5, f"Bill To: {partner.name if partner else 'N/A'}", ln=True)
    
    # Table Header
    pdf.set_y(70)
    pdf.set_fill_color(200, 220, 255)
    pdf.cell(90, 8, "Item", border=1, fill=True)
    pdf.cell(30, 8, "Qty", border=1, fill=True, align="C")
    pdf.cell(30, 8, "Price", border=1, fill=True, align="R")
    pdf.cell(40, 8, "Total", border=1, fill=True, align="R")
    
    # Table Rows
    for line in lines:
        # Fetch item name for better PDF display
        item = session.get(Item, line.item_id)
        item_name = item.name if item else f"Item ID: {line.item_id}"
        
        pdf.cell(90, 8, item_name, border=1)
        pdf.cell(30, 8, str(line.quantity), border=1, align="C")
        pdf.cell(30, 8, f"${line.unit_price}", border=1, align="R")
        pdf.cell(40, 8, f"${line.total_price}", border=1, align="R")
        
    # Totals
    pdf.ln(10)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(150, 10, "Total Amount:", align="R")
    pdf.cell(40, 10, f"${invoice.total_amount}", border=1, align="R")

    # Save and return
    pdf_dir = Path(__file__).resolve().parent.parent / "static" / "uploads"
    pdf_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = pdf_dir / f"invoice_{invoice.number}.pdf"
    
    pdf.output(str(pdf_path))
    
    return FileResponse(str(pdf_path), media_type='application/pdf', filename=f"Invoice_{invoice.number}.pdf")