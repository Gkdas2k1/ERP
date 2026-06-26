from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_session
from ..models.accounting import Account, JournalEntry
from ..models.audit import AuditLog
from ..dependencies import require_role

router = APIRouter(prefix="/api/accounting", tags=["Accounting & Auditing"])

# --- Chart of Accounts ---
@router.get("/accounts", response_model=list[Account])
def get_accounts(session: Session = Depends(get_session)):
    return session.exec(select(Account)).all()

@router.post("/accounts", response_model=Account)
def create_account(account: Account, session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    session.add(account)
    session.commit()
    session.refresh(account)
    return account

# --- Journal Entries ---
@router.get("/journal-entries", response_model=list[JournalEntry])
def get_journal_entries(session: Session = Depends(get_session)):
    return session.exec(select(JournalEntry)).all()

# --- Audit Trail ---
@router.get("/audit-logs", response_model=list[AuditLog])
def get_audit_logs(session: Session = Depends(get_session), user=Depends(require_role("admin"))):
    # Order by timestamp descending to show latest first
    statement = select(AuditLog).order_by(AuditLog.timestamp.desc())
    return session.exec(statement).all()