from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime, timedelta
from ..database import get_session
from ..models.transactions import Invoice
from ..models.inventory import StockLevel, Item
from ..dependencies import require_role
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

router = APIRouter(prefix="/api/analytics", tags=["Dashboard Analytics"])

@router.get("/dashboard")
def get_dashboard_data(session: Session = Depends(get_session)):
    # 1. Calculate Real-time KPIs
    total_revenue = sum(inv.total_amount for inv in session.exec(select(Invoice)).all() if inv.status == 'paid')
    pending_invoices = len([inv for inv in session.exec(select(Invoice)).all() if inv.status == 'open'])
    
    low_stock_items = 0
    for stock in session.exec(select(StockLevel)).all():
        if stock.quantity_on_hand <= stock.reorder_level:
            low_stock_items += 1

    # 2. Prepare Data for Forecasting (Last 30 days of sales)
    invoices = session.exec(select(Invoice)).all()
    sales_data = [{"date": inv.date, "amount": float(inv.total_amount)} for inv in invoices if inv.date]
    
    df = pd.DataFrame(sales_data)
    forecast_data = []
    
    if len(df) > 2:
        df['date'] = pd.to_datetime(df['date'])
        df = df.groupby(df['date'].dt.date)['amount'].sum().reset_index()
        df['date_ordinal'] = df['date'].apply(lambda x: x.toordinal())
        
        # Train Linear Regression Model
        X = df[['date_ordinal']]
        y = df['amount']
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next 7 days
        last_date = df['date'].max()
        future_dates = [last_date + timedelta(days=i) for i in range(1, 8)]
        future_ordinals = [[d.toordinal()] for d in future_dates]
        predictions = model.predict(future_ordinals)
        
        forecast_data = [
            {"date": d.strftime("%Y-%m-%d"), "predicted_sales": max(0, round(float(p), 2))} 
            for d, p in zip(future_dates, predictions)
        ]
        
        # Historical data for chart
        historical_data = [
            {"date": row['date'].strftime("%Y-%m-%d"), "actual_sales": round(float(row['amount']), 2)} 
            for _, row in df.iterrows()
        ]
    else:
        # Fallback if not enough data
        historical_data = []

    return {
        "kpis": {
            "total_revenue": round(total_revenue, 2),
            "pending_invoices": pending_invoices,
            "low_stock_items": low_stock_items
        },
        "historical_sales": historical_data,
        "forecast_sales": forecast_data
    }