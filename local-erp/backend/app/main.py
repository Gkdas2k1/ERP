from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # <-- ADD THIS
from sqlmodel import Session
from fastapi.responses import FileResponse
from fastapi import HTTPException
from contextlib import asynccontextmanager
from pathlib import Path
from .database import create_db_and_tables, get_session
from .routers import auth, settings
from .routers import auth, settings, inventory, sales
from .routers import auth, settings, inventory, sales, accounting, analytics

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
app.include_router(accounting.router) # <-- Add this
app.include_router(analytics.router)  # <-- Add this
#@app.get("/")
#def read_root():
#    return {"message": "Local ERP Backend is running securely."}

@app.get("/api/health")
def health_check(session: Session = Depends(get_session)):
    return {"status": "healthy", "db_connected": True}

# 1. Mount the React Build as a static directory
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "static" / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

# 2. Catch-all route for React Router (SPA)
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    # If the path is an API route or static file, let FastAPI handle it naturally
    if full_path.startswith("api/") or full_path.startswith("static/"):
        raise HTTPException(status_code=404, detail="Not found")
        
    # Otherwise, serve the React index.html
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    return {"message": "Frontend not built yet. Run 'npm run build' in the frontend folder."}