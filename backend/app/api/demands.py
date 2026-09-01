from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List, Dict, Any
from ..services.data_store import db

router = APIRouter(prefix="/api/demands", tags=["Buyer RFP Demands"])

@router.get("/all")
def get_all_demands(commodity: Optional[str] = None):
    results = db.demands
    if commodity and commodity.lower() != "all":
        results = [d for d in results if commodity.lower() in d["commodity"].lower()]
    return results

@router.post("/create")
def create_buyer_demand(demand_data: Dict[str, Any] = Body(...)):
    required = ["buyer_name", "commodity", "required_grade", "quantity_needed_q", "target_price_per_q"]
    for r in required:
        if r not in demand_data:
            raise HTTPException(status_code=400, detail=f"Missing field: {r}")
            
    demand_data.setdefault("company_name", demand_data.get("buyer_name", "Agri Enterprise"))
    demand_data.setdefault("buyer_type", "Processor")
    demand_data.setdefault("delivery_location", "Central Hub")
    demand_data.setdefault("max_radius_km", 500.0)
    
    return db.post_buyer_demand(demand_data)
