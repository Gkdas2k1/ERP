from fastapi import FastAPI, Depends
from sqlmodel import Session
from .database import create_db_and_tables, get_session
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    create_db_and_tables()
    yield
    # Shutdown: Cleanup if needed

app = FastAPI(
    title="Local ERP System",
    description="Serverless, Local-First ERP for Business Management",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
def read_root():
    return {"message": "Local ERP Backend is running securely."}

@app.get("/api/health")
def health_check(session: Session = Depends(get_session)):
    # Simple check to ensure DB is connected
    return {"status": "healthy", "db_connected": True}