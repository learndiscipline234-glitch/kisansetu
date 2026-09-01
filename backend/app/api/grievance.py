from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from ..services.data_store import db
from ..services.mandi_aggregator import mandi_service

router = APIRouter(prefix="/api/grievances", tags=["Disputes & Grievance Redressal"])

@router.get("/all")
def get_all_grievances():
    return db.grievances

@router.post("/create")
def submit_grievance(data: Dict[str, Any] = Body(...)):
    required = ["order_id", "filed_by", "issue_type", "description"]
    for r in required:
        if r not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {r}")
            
    data.setdefault("evidence_images", [])
    data.setdefault("resolution_notes", "Assigned to APMC Field Mediation Officer.")
    return db.submit_grievance(data)
