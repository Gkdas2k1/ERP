from sqlmodel import SQLModel, create_engine, Session
import os

# For Phase 1, we use standard SQLite. 
DB_PATH = "local_erp_data.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    # CRITICAL: Import all models here so SQLModel registers them before creating tables
    from .models import base, auth, settings, inventory, accounting, transactions
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session