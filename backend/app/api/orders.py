from fastapi import APIRouter, HTTPException, Body, Query
from typing import Optional, List, Dict, Any
from ..services.escrow_ledger import escrow_service, ledger_service

router = APIRouter(prefix="/api/orders", tags=["Escrow Orders & Immutable Ledger"])

@router.get("/all")
def get_all_orders():
    return escrow_service.get_all_orders()

@router.get("/{order_id}")
def get_order_by_id(order_id: str):
    order = escrow_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/update-status")
def update_order_escrow_status(order_id: str, data: Dict[str, Any] = Body(...)):
    new_status = data.get("status")
    actor = data.get("actor", "Authorized Operator")
    notes = data.get("notes", "")
    
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing new status")
        
    order = escrow_service.update_order_status(order_id, new_status, actor, notes)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return {
        "message": f"Order status updated to {new_status}",
        "order": order
    }

@router.get("/ledger/history")
def get_ledger_history(order_id: Optional[str] = Query(None)):
    return ledger_service.get_ledger_history(order_id)
