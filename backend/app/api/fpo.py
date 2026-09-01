from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List, Dict, Any
from ..services.data_store import db

router = APIRouter(prefix="/api/fpo", tags=["FPO Collective Aggregation"])

@router.get("/pools")
def get_all_fpo_pools():
    return db.fpo_pools

@router.post("/pools/create")
def create_fpo_pool(pool_data: Dict[str, Any] = Body(...)):
    required = ["fpo_name", "commodity", "target_quantity_q", "collective_base_price_per_q"]
    for r in required:
        if r not in pool_data:
            raise HTTPException(status_code=400, detail=f"Missing field: {r}")
            
    pool_data.setdefault("district", "Nashik")
    pool_data.setdefault("state", "Maharashtra")
    pool_data.setdefault("variety", "Standard Bulk Grade")
    pool_data.setdefault("estimated_buyer_premium_pct", 7.5)
    
    return db.create_fpo_pool(pool_data)

@router.post("/pools/{fpo_id}/join")
def join_fpo_pool(fpo_id: str, data: Dict[str, Any] = Body(...)):
    quantity_q = data.get("quantity_q", 10.0)
    farmer_name = data.get("farmer_name", "Individual Farmer")
    
    pool = db.join_fpo_pool(fpo_id, quantity_q)
    if not pool:
        raise HTTPException(status_code=404, detail="FPO pool not found")
        
    return {
        "message": f"Successfully pooled {quantity_q} Quintals with {pool['fpo_name']}!",
        "pool": pool,
        "estimated_premium_payout": round(quantity_q * pool["collective_base_price_per_q"] * (1 + pool["estimated_buyer_premium_pct"]/100), 2)
    }
