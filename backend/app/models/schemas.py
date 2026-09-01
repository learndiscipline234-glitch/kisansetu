from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class QualityGrade(str, Enum):
    GRADE_A = 'Grade A'
    GRADE_B = 'Grade B'
    GRADE_C = 'Grade C'

class LotStatus(str, Enum):
    AVAILABLE = 'AVAILABLE'
    OFFER_RECEIVED = 'OFFER_RECEIVED'
    IN_ESCROW = 'IN_ESCROW'
    DISPATCHED = 'DISPATCHED'
    DELIVERED = 'DELIVERED'
    COMPLETED = 'COMPLETED'

class EscrowStatus(str, Enum):
    PENDING_DEPOSIT = 'PENDING_DEPOSIT'
    DEPOSITED = 'DEPOSITED'
    IN_TRANSIT = 'IN_TRANSIT'
    INSPECTION_VERIFIED = 'INSPECTION_VERIFIED'
    RELEASED = 'RELEASED'
    DISPUTED = 'DISPUTED'

class MandiPriceItem(BaseModel):
    mandi_id: str
    mandi_name: str
    district: str
    state: str
    commodity: str
    variety: str
    arrival_tonnes: float
    min_price: float
    max_price: float
    modal_price: float
    price_change_24h: float
    distance_km: Optional[float] = 0.0
    lat: float
    lng: float
    last_updated: str

class ArbitrageOpportunity(BaseModel):
    source_mandi: str
    target_mandi: str
    commodity: str
    source_price: float
    target_price: float
    price_diff: float
    distance_km: float
    est_freight_cost: float
    net_profit_per_quintal: float
    recommendation: str

class ForecastPoint(BaseModel):
    date: str
    predicted_price: float
    lower_bound: float
    upper_bound: float
    seasonal_factor: float

class PriceForecastResponse(BaseModel):
    commodity: str
    mandi_name: str
    current_modal_price: float
    historical_7d: List[Dict[str, Any]]
    forecast_30d: List[ForecastPoint]
    sale_window_recommendation: str # e.g. 'HOLD_FOR_8_DAYS', 'SELL_NOW'
    optimal_sale_date: str
    expected_gain_percent: float
    distress_risk_score: float # 0 - 100
    market_sentiment: str # 'Bullish', 'Bearish', 'Stable'
    key_drivers: List[str]

class QualityGradingResult(BaseModel):
    commodity: str
    grade: QualityGrade
    confidence_score: float
    uniformity_score: float
    defect_percentage: float
    estimated_moisture_pct: float
    color_vibrancy_score: float
    recommended_min_price: float
    certificate_hash: str
    features_detected: List[str]
    grading_timestamp: str

class ProduceLot(BaseModel):
    lot_id: str
    farmer_name: str
    farmer_phone: str
    state: str
    district: str
    mandi_nearby: str
    commodity: str
    variety: str
    quantity_quintals: float
    base_price_per_q: float
    quality_grade: QualityGrade
    quality_metrics: Dict[str, Any]
    certificate_hash: str
    images: List[str]
    is_fpo_pooled: bool = False
    fpo_id: Optional[str] = None
    created_at: str
    status: LotStatus
    active_bids_count: int = 0
    highest_bid_per_q: Optional[float] = None

class FpoPool(BaseModel):
    fpo_id: str
    fpo_name: str
    district: str
    state: str
    commodity: str
    variety: str
    target_quantity_q: float
    current_quantity_q: float
    member_farmers_count: int
    collective_base_price_per_q: float
    estimated_buyer_premium_pct: float
    status: str
    created_at: str

class BuyerDemand(BaseModel):
    demand_id: str
    buyer_name: str
    company_name: str
    buyer_type: str # 'Processor', 'Wholesaler', 'Exporter', 'Retail Chain'
    commodity: str
    variety: Optional[str] = 'Any'
    required_grade: QualityGrade
    quantity_needed_q: float
    target_price_per_q: float
    delivery_location: str
    max_radius_km: float
    status: str
    posted_at: str

class TradeOffer(BaseModel):
    offer_id: str
    lot_id: str
    buyer_name: str
    buyer_company: str
    buyer_rating: float
    offered_price_per_q: float
    total_amount: float
    message: str
    status: str # 'PENDING', 'ACCEPTED', 'COUNTERED', 'REJECTED'
    created_at: str

class EscrowOrder(BaseModel):
    order_id: str
    lot_id: str
    offer_id: str
    farmer_name: str
    buyer_name: str
    commodity: str
    quantity_quintals: float
    price_per_q: float
    total_amount: float
    escrow_status: EscrowStatus
    tracking_number: str
    transporter_name: str
    origin_mandi: str
    destination_city: str
    delivery_otp: str
    inspection_passed: bool = False
    created_at: str
    updated_at: str

class LedgerBlock(BaseModel):
    block_index: int
    timestamp: str
    event_type: str
    order_id: str
    lot_id: str
    actor: str
    payload_summary: str
    previous_hash: str
    block_hash: str

class VoiceQueryRequest(BaseModel):
    query_text: str
    language: Optional[str] = 'hi' # hi, en, mr, te, pa

class VoiceQueryResponse(BaseModel):
    query: str
    detected_intent: str
    language: str
    speech_response_text: str
    audio_hint: Optional[str] = None
    structured_data: Optional[Dict[str, Any]] = None

class GrievanceRecord(BaseModel):
    grievance_id: str
    order_id: str
    filed_by: str
    issue_type: str
    description: str
    evidence_images: List[str]
    status: str
    created_at: str
    resolution_notes: Optional[str] = None
