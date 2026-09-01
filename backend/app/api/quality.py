from fastapi import APIRouter, UploadFile, File, Form, Query, Body
from typing import Optional, Dict, Any
from ..services.quality_vision import quality_grader_service
from ..services.mandi_aggregator import mandi_service

router = APIRouter(prefix="/api/quality", tags=["AI Computer Vision Quality Grading"])

@router.post("/grade-image")
async def grade_uploaded_produce_image(
    file: UploadFile = File(...),
    commodity: str = Form("Tomato"),
    mandi_id: Optional[str] = Form(None)
):
    base_modal_price = 2200.0
    if mandi_id:
        mandi = mandi_service.get_mandi_by_id(mandi_id)
        if mandi:
            base_modal_price = mandi["modal_price"]
    else:
        mandis = mandi_service.get_all_records(commodity=commodity)
        if mandis:
            base_modal_price = mandis[0]["modal_price"]

    contents = await file.read()
    result = quality_grader_service.analyze_image_bytes(contents, commodity, base_modal_price)
    return result

@router.post("/grade-preset")
def grade_sample_preset(
    commodity: str = Query("Wheat", description="Crop name"),
    sample_quality: str = Query("A", description="A, B, or C quality tier"),
    base_price: Optional[float] = Query(None, description="Custom base price")
):
    if not base_price:
        mandis = mandi_service.get_all_records(commodity=commodity)
        base_price = mandis[0]["modal_price"] if mandis else 2400.0
        
    return quality_grader_service.grade_sample_preset(commodity, sample_quality, base_price)
