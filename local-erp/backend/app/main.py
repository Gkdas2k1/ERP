# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session
from contextlib import asynccontextmanager
from pathlib import Path
from .database import create_db_and_tables, get_session
from .routers import auth, settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title="Local ERP System",
    description="Serverless, Local-First ERP for Business Management",
    version="1.0.0",
    lifespan=lifespan
)

# 1. Mount static files for logos/watermarks
STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# 2. Include Routers
app.include_router(auth.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {"message": "Local ERP Backend is running securely."}

@app.get("/api/health")
def health_check(session: Session = Depends(get_session)):
    return {"status": "healthy", "db_connected": True}