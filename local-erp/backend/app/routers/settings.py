from fastapi import APIRouter, Depends, UploadFile, File
from sqlmodel import Session, select
from typing import Optional
from ..database import get_session
from ..models.settings import CompanySettings, CompanySettingsCreate
from ..dependencies import require_role
from ..core.config import UPLOAD_DIR
import shutil

router = APIRouter(prefix="/api/settings", tags=["Company Settings"])

@router.get("/", response_model=Optional[CompanySettings])
def get_settings(session: Session = Depends(get_session)):
    return session.exec(select(CompanySettings)).first()

@router.post("/", response_model=CompanySettings)
def update_settings(
    settings_data: CompanySettingsCreate,  # <--- CHANGED: Now uses the clean Pydantic model
    session: Session = Depends(get_session),
    current_user=Depends(require_role("admin"))
):
    settings = session.exec(select(CompanySettings)).first()
    
    if not settings:
        # If no settings exist yet, create a new row in the database
        settings = CompanySettings(**settings_data.model_dump())
        session.add(settings)
    else:
        # If settings exist, update only the fields that were sent
        for key, value in settings_data.model_dump(exclude_unset=True).items():
            setattr(settings, key, value)
            
    session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings

@router.post("/logo")
def upload_logo(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user=Depends(require_role("admin"))
):
    file_path = UPLOAD_DIR / f"logo_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    url = f"/static/uploads/logo_{file.filename}"
    
    settings = session.exec(select(CompanySettings)).first()
    if settings:
        settings.logo_path = url
        session.add(settings)
        session.commit()
        
    return {"filename": file.filename, "url": url}

@router.post("/watermark")
def upload_watermark(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user=Depends(require_role("admin"))
):
    file_path = UPLOAD_DIR / f"watermark_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    url = f"/static/uploads/watermark_{file.filename}"
    
    settings = session.exec(select(CompanySettings)).first()
    if settings:
        settings.watermark_path = url
        session.add(settings)
        session.commit()
        
    return {"filename": file.filename, "url": url}