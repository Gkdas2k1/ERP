from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from ..database import get_session
from ..models.transactions import Invoice, InvoiceLine, Partner
from ..models.inventory import StockLevel
from ..models.settings import CompanySettings
from ..dependencies import require_role
from fpdf import FPDF
import os
from datetime import date

router = APIRouter(prefix="/api/sales", tags=["Sales & Invoicing"])

@router.get("/invoices", response_model=list[Invoice])
def get_invoices(session: Session = Depends(get_session)):
    return session.exec(select(Invoice)).all()

@router.post("/invoices", response_model=Invoice)
def create_invoice(invoice: Invoice, session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    # 1. Save Invoice and Lines
    session.add(invoice)
    session.commit()
    session.refresh(invoice)
    
    for line in invoice.lines:
        line.invoice_id = invoice.id
        session.add(line)
        session.commit()
        
        # 2. Deduct Stock (Assuming default warehouse_id = 1 for simplicity)
        stock = session.exec(select(StockLevel).where(StockLevel.item_id == line.item_id)).first()
        if stock:
            stock.quantity_on_hand -= line.quantity
            session.add(stock)
            session.commit()
            
    return invoice

# --- PDF Generation ---
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
        # Remove the /static/ prefix to get local path
        local_logo = settings.logo_path.replace("/static/", "")
        if os.path.exists(local_logo):
            pdf.image(local_logo, x=10, y=8, w=40)
            
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
        pdf.cell(90, 8, f"Item ID: {line.item_id}", border=1)
        pdf.cell(30, 8, str(line.quantity), border=1, align="C")
        pdf.cell(30, 8, f"${line.unit_price}", border=1, align="R")
        pdf.cell(40, 8, f"${line.total_price}", border=1, align="R")
        
    # Totals
    pdf.ln(10)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(150, 10, "Total Amount:", align="R")
    pdf.cell(40, 10, f"${invoice.total_amount}", border=1, align="R")

    # Save and return
    pdf_path = f"static/uploads/invoice_{invoice.number}.pdf"
    pdf.output(pdf_path)
    
    return FileResponse(pdf_path, media_type='application/pdf', filename=f"Invoice_{invoice.number}.pdf")