from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List, Dict, Any
from ..services.data_store import db
from ..services.matcher import matcher_service
from ..services.escrow_ledger import escrow_service

router = APIRouter(prefix="/api/lots", tags=["Produce Lots & Matchmaking"])

@router.get("/all")
def get_all_lots(
    commodity: Optional[str] = None,
    grade: Optional[str] = None,
    fpo_only: Optional[bool] = False
):
    results = db.lots
    if commodity and commodity.lower() != "all":
        results = [lot for lot in results if commodity.lower() in lot["commodity"].lower()]
    if grade and grade.lower() != "all":
        results = [lot for lot in results if lot["quality_grade"].lower() == grade.lower()]
    if fpo_only:
        results = [lot for lot in results if lot.get("is_fpo_pooled", False)]
    return results

@router.get("/{lot_id}")
def get_lot_by_id(lot_id: str):
    for lot in db.lots:
        if lot["lot_id"] == lot_id:
            return lot
    raise HTTPException(status_code=404, detail="Produce lot not found")

@router.post("/create")
def create_produce_lot(lot_data: Dict[str, Any] = Body(...)):
    required_fields = ["farmer_name", "commodity", "quantity_quintals", "base_price_per_q", "quality_grade"]
    for f in required_fields:
        if f not in lot_data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {f}")
            
    # Default fallbacks
    lot_data.setdefault("farmer_phone", "+91 98000 00000")
    lot_data.setdefault("state", "Maharashtra")
    lot_data.setdefault("district", "Nashik")
    lot_data.setdefault("mandi_nearby", "Regional APMC")
    lot_data.setdefault("variety", "Standard Hybrid")
    lot_data.setdefault("quality_metrics", {
        "uniformity_score": 92.0,
        "defect_percentage": 2.5,
        "estimated_moisture_pct": 11.2,
        "color_vibrancy_score": 88.0
    })
    lot_data.setdefault("certificate_hash", "CERT-QS-NEW-PRODUCE")
    lot_data.setdefault("images", ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"])
    lot_data.setdefault("is_fpo_pooled", False)
    lot_data.setdefault("lat", 20.0)
    lot_data.setdefault("lng", 75.0)
    
    new_lot = db.create_lot(lot_data)
    
    # Record to ledger
    escrow_service.ledger.record_event(
        "LOT_LISTED",
        "SYSTEM_UNASSIGNED",
        new_lot["lot_id"],
        new_lot["farmer_name"],
        f"Listed {new_lot['quantity_quintals']} Quintals of {new_lot['quality_grade']} {new_lot['commodity']} at base price ₹{new_lot['base_price_per_q']}/Q."
    )
    
    return new_lot

@router.get("/{lot_id}/matches")
def get_lot_buyer_matches(lot_id: str):
    lot = None
    for l in db.lots:
        if l["lot_id"] == lot_id:
            lot = l
            break
    if not lot:
        raise HTTPException(status_code=404, detail="Produce lot not found")
        
    return matcher_service.find_matches_for_lot(lot)

@router.get("/{lot_id}/offers")
def get_offers_for_lot(lot_id: str):
    return [off for off in db.offers if off["lot_id"] == lot_id]

@router.post("/offer/create")
def place_trade_offer(offer_data: Dict[str, Any] = Body(...)):
    if "lot_id" not in offer_data or "offered_price_per_q" not in offer_data:
        raise HTTPException(status_code=400, detail="Missing lot_id or offered_price_per_q")
        
    offer_data.setdefault("buyer_name", "Verified Agri Buyer")
    offer_data.setdefault("buyer_company", "AgriCorp Procurements")
    offer_data.setdefault("buyer_rating", 4.9)
    offer_data.setdefault("message", "Ready for direct farm-gate pickup. 100% Escrow backed.")
    
    # calculate total
    for lot in db.lots:
        if lot["lot_id"] == offer_data["lot_id"]:
            offer_data["total_amount"] = round(lot["quantity_quintals"] * offer_data["offered_price_per_q"], 2)
            break
            
    new_offer = db.create_offer(offer_data)
    return new_offer

@router.post("/offer/accept")
def accept_trade_offer(data: Dict[str, Any] = Body(...)):
    offer_id = data.get("offer_id")
    if not offer_id:
        raise HTTPException(status_code=400, detail="Missing offer_id")
        
    target_offer = None
    for off in db.offers:
        if off["offer_id"] == offer_id:
            target_offer = off
            break
    if not target_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    target_lot = None
    for lot in db.lots:
        if lot["lot_id"] == target_offer["lot_id"]:
            target_lot = lot
            break
    if not target_lot:
        raise HTTPException(status_code=404, detail="Associated lot not found")
        
    target_offer["status"] = "ACCEPTED"
    target_lot["status"] = "IN_ESCROW"
    
    # Create Escrow Order & trigger smart contract ledger
    order = escrow_service.create_order_from_accepted_offer(target_lot, target_offer)
    
    return {
        "message": "Offer accepted successfully! Escrow order created and funds secured.",
        "order": order,
        "offer": target_offer,
        "lot": target_lot
    }
