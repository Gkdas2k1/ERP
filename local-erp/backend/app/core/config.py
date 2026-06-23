# backend/app/core/config.py
from pathlib import Path

# Base directory of the app
BASE_DIR = Path(__file__).resolve().parent.parent

# Security (For a local desktop app, a hardcoded key is fine, but you can change it)
SECRET_KEY = "super-secret-key-change-this-in-production-local-erp"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days for local app convenience

# File Uploads
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)