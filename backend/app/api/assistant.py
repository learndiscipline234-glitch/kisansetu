from fastapi import APIRouter, Body
from typing import Dict, Any
from ..services.voice_assistant import voice_service
from ..services.mandi_aggregator import mandi_service

router = APIRouter(prefix="/api/assistant", tags=["Multilingual Voice & SMS Gateway"])

@router.post("/voice-query")
def process_voice_speech(data: Dict[str, Any] = Body(...)):
    query = data.get("query", "गेहूं का भाव क्या है?")
    lang = data.get("language", "hi")
    return voice_service.process_voice_query(query, lang)

@router.post("/sms-simulate")
def simulate_sms_ussd(data: Dict[str, Any] = Body(...)):
    raw_text = data.get("message", "BHAV ONION").strip()
    phone = data.get("phone_number", "+91 98221 00000")
    
    parts = raw_text.split()
    cmd = parts[0].upper() if parts else "HELP"
    crop = parts[1].capitalize() if len(parts) > 1 else "Wheat"
    
    if cmd in ["BHAV", "PRICE", "RATE", "MANDI"]:
        mandis = mandi_service.get_all_records(commodity=crop)
        if mandis:
            m = mandis[0]
            reply = f"KisanSetu SMS Alert: {m['commodity']} in {m['mandi_name']} is Rs.{m['modal_price']}/Q (Min: {m['min_price']}, Max: {m['max_price']}). Trend: {'+' if m['price_change_24h'] >= 0 else ''}{m['price_change_24h']}%. Reply 'HOLD {crop.upper()}' for AI advice."
        else:
            reply = f"KisanSetu: No active mandi found for {crop}. Valid crops: Wheat, Onion, Tomato, Soybean, Cotton, Potato."
            
    elif cmd in ["HOLD", "ADVICE", "TREND", "SELL"]:
        mandis = mandi_service.get_all_records(commodity=crop)
        price = mandis[0]["modal_price"] if mandis else 2400.0
        from ..services.ml_forecaster import forecaster_service
        fc = forecaster_service.forecast_commodity_price(crop, price)
        reply = f"KisanSetu AI Advisor: For {crop}, {fc['sale_window_recommendation']}. Expected peak around {fc['optimal_sale_date']} (+{fc['expected_gain_percent']}%). Distress Risk: {fc['distress_risk_score']}/100."
        
    elif cmd in ["ORDER", "ESCROW", "STATUS"]:
        from ..services.escrow_ledger import escrow_service
        orders = escrow_service.get_all_orders()
        latest = orders[0] if orders else None
        if latest:
            reply = f"KisanSetu Escrow: Order #{latest['order_id']} for {latest['quantity_quintals']}Q {latest['commodity']} is {latest['escrow_status']}. Payout Rs.{latest['total_amount']:,.0f} safe in Escrow."
        else:
            reply = "KisanSetu: No active orders found for this mobile number."
            
    else:
        reply = "KisanSetu SMS Commands:\n- BHAV <CROP> (e.g. BHAV WHEAT)\n- HOLD <CROP> (AI Sale Advice)\n- ESCROW (Payment status)\nHelpline: 1800-KISAN-SETU"
        
    return {
        "phone_number": phone,
        "input_command": raw_text,
        "sms_reply": reply,
        "timestamp": "Just now"
    }
