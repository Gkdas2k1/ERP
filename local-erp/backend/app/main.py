from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # <-- ADD THIS
from sqlmodel import Session
from contextlib import asynccontextmanager
from pathlib import Path
from .database import create_db_and_tables, get_session
from .routers import auth, settings
from .routers import auth, settings, inventory, sales

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

# --- ADD CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:1420",  # Tauri dev server
        "http://127.0.0.1:1420",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END CORS ---

# Mount static files for logos/watermarks
STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(auth.router)
app.include_router(settings.router)
app.include_router(inventory.router) # <-- Add this
app.include_router(sales.router)      # <-- Add this
@app.get("/")
def read_root():
    return {"message": "Local ERP Backend is running securely."}

@app.get("/api/health")
def health_check(session: Session = Depends(get_session)):
    return {"status": "healthy", "db_connected": True}