from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from ..services.mandi_aggregator import mandi_service
from ..services.ml_forecaster import forecaster_service

router = APIRouter(prefix="/api/prices", tags=["Mandi Prices & Forecasting"])

@router.get("/all")
def get_all_prices(
    commodity: Optional[str] = Query(None, description="Filter by crop name"),
    state: Optional[str] = Query(None, description="Filter by state"),
    search: Optional[str] = Query(None, description="Keyword search in mandi/district")
):
    return mandi_service.get_all_records(commodity=commodity, state=state, search=search)

@router.get("/mandi/{mandi_id}")
def get_mandi_details(mandi_id: str):
    mandi = mandi_service.get_mandi_by_id(mandi_id)
    if not mandi:
        raise HTTPException(status_code=404, detail="Mandi not found")
    return mandi

@router.get("/forecast")
def get_price_forecast(
    commodity: str = Query("Wheat", description="Commodity name"),
    mandi_id: Optional[str] = Query(None, description="Mandi ID for localized baseline")
):
    modal_price = 2450.0
    mandi_name = "Regional APMC"
    if mandi_id:
        mandi = mandi_service.get_mandi_by_id(mandi_id)
        if mandi:
            modal_price = mandi["modal_price"]
            mandi_name = mandi["mandi_name"]
            
    return forecaster_service.forecast_commodity_price(commodity, modal_price, mandi_name)

@router.get("/arbitrage")
def get_arbitrage_opportunities(
    source_mandi_id: str = Query("MH-NAS-01", description="Farmer's nearest local mandi"),
    commodity: Optional[str] = Query(None, description="Commodity"),
    max_radius_km: float = Query(450.0, description="Max transit radius"),
    freight_rate_per_km_q: float = Query(1.4, description="Freight cost in INR per km per quintal")
):
    return mandi_service.calculate_arbitrage_opportunities(
        source_mandi_id=source_mandi_id,
        commodity=commodity,
        max_radius_km=max_radius_km,
        freight_rate_per_km_q=freight_rate_per_km_q
    )

@router.get("/kpis")
def get_market_kpis():
    return mandi_service.get_market_kpis()

@router.get("/commodities")
def get_commodities():
    return mandi_service.get_available_commodities()

@router.get("/states")
def get_states():
    return mandi_service.get_available_states()
