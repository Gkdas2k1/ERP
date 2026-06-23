# Local ERP (Enterprise Resource Planning)

A local-first, premium Enterprise Resource Planning system powered by a Python FastAPI backend and a React + Vite + TypeScript frontend, designed to run natively as a desktop app via Tauri v2.

## Project Structure

```
local-erp/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application entry point
│   │   ├── database.py         # SQLite/SQLCipher connection & session
│   │   ├── models/             # SQLModel Database Schemas
│   │   │   ├── __init__.py
│   │   │   ├── base.py         # Base classes (timestamps, IDs)
│   │   │   ├── auth.py         # Users, Roles
│   │   │   ├── settings.py     # Company details, branding
│   │   │   ├── inventory.py    # Items, Warehouses
│   │   │   ├── accounting.py   # Chart of Accounts, Journal Entries
│   │   │   └── transactions.py # Purchase, Sales, Invoices
│   │   ├── routers/            # API Endpoints
│   │   └── services/           # Business logic & ML integrations
│   ├── requirements.txt
│   └── alembic/                # Database migrations
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # shadcn/ui & custom components
│   │   ├── pages/              # Dashboard, Settings, Inventory, etc.
│   │   ├── services/           # API calls to FastAPI
│   │   └── App.tsx
│   ├── package.json
│   └── src-tauri/              # Tauri v2 Rust configuration
└── README.md
```

## Setup Instructions

### Backend (FastAPI)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend & Tauri App

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server (web):
   ```bash
   npm run dev
   ```
4. Run as a Tauri desktop app:
   ```bash
   npm run tauri dev
   ```
