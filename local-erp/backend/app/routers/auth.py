# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel
from ..database import get_session
from ..models.auth import User
from ..core.security import verify_password, get_password_hash, create_access_token
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str

@router.post("/setup", response_model=Token)
def initial_admin_setup(user_data: UserCreate, session: Session = Depends(get_session)):
    """Creates the first admin user. Only works if NO users exist in the database."""
    existing_user = session.exec(select(User)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="System already initialized. Use /login.")
    
    new_user = User(
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role="admin"
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
        
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user