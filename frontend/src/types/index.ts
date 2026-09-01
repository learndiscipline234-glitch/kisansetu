export type Role = 'farmer' | 'buyer' | 'fpo' | 'govt' | 'sms_phone';
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'pa';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface MandiRecord {
  mandi_id: string;
  mandi_name: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  arrival_tonnes: number;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_change_24h: number;
  distance_km?: number;
  lat: number;
  lng: number;
  last_updated?: string;
}

export interface ArbitrageOpportunity {
  source_mandi: string;
  source_price: number;
  target_mandi_id: string;
  target_mandi: string;
  commodity: string;
  target_price: number;
  price_diff: number;
  distance_km: number;
  est_freight_cost: number;
  net_profit_per_quintal: number;
  recommendation: string;
  status_color?: 'green' | 'yellow' | 'red';
  lat: number;
  lng: number;
}

export interface ForecastPoint {
  date: string;
  predicted_price: number;
  lower_bound: number;
  upper_bound: number;
  seasonal_factor: number;
}

export interface PriceForecast {
  commodity: string;
  mandi_name: string;
  current_modal_price: number;
  historical_7d: Array<{ date: string; price: number; arrival_index: number }>;
  forecast_30d: ForecastPoint[];
  sale_window_recommendation: string;
  recommendation_detail: string;
  optimal_sale_date: string;
  expected_gain_percent: number;
  distress_risk_score: number;
  market_sentiment: string;
  key_drivers: string[];
}

export interface QualityMetrics {
  uniformity_score: number;
  defect_percentage: number;
  estimated_moisture_pct: number;
  color_vibrancy_score: number;
}

export interface QualityGradingResult {
  commodity: string;
  grade: QualityGrade;
  grade_description: string;
  confidence_score: number;
  uniformity_score: number;
  defect_percentage: number;
  estimated_moisture_pct: number;
  color_vibrancy_score: number;
  recommended_min_price: number;
  price_premium_pct: number;
  certificate_hash: string;
  features_detected: string[];
  grading_timestamp: string;
}

export interface ProduceLot {
  lot_id: string;
  farmer_name: string;
  farmer_phone: string;
  state: string;
  district: string;
  mandi_nearby: string;
  commodity: string;
  variety: string;
  quantity_quintals: number;
  base_price_per_q: number;
  quality_grade: QualityGrade;
  quality_metrics: QualityMetrics;
  certificate_hash: string;
  images: string[];
  is_fpo_pooled: boolean;
  fpo_id?: string | null;
  created_at: string;
  status: 'AVAILABLE' | 'OFFER_RECEIVED' | 'IN_ESCROW' | 'DISPATCHED' | 'DELIVERED' | 'COMPLETED';
  active_bids_count: number;
  highest_bid_per_q?: number | null;
}

export interface VerifiedBuyer {
  buyer_id: string;
  company_name: string;
  buyer_type: string;
  contact_person: string;
  verified_badge: boolean;
  trust_score: number;
  preferred_commodities: string[];
  min_grade: QualityGrade;
  warehouse_location: string;
  lat: number;
  lng: number;
  max_procurement_radius_km: number;
  payment_terms: string;
}

export interface MatchResult {
  buyer: VerifiedBuyer;
  distance_km: number;
  match_score: number;
  match_reasons: string[];
  suggested_bid_per_q: number;
}

export interface TradeOffer {
  offer_id: string;
  lot_id: string;
  buyer_name: string;
  buyer_company: string;
  buyer_rating: number;
  offered_price_per_q: number;
  total_amount: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED';
  created_at: string;
}

export interface EscrowOrder {
  order_id: string;
  lot_id: string;
  offer_id: string;
  farmer_name: string;
  farmer_phone: string;
  buyer_name: string;
  commodity: string;
  variety: string;
  quantity_quintals: number;
  price_per_q: number;
  total_amount: number;
  escrow_status: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'IN_TRANSIT' | 'INSPECTION_VERIFIED' | 'RELEASED' | 'DISPUTED';
  tracking_number: string;
  transporter_name: string;
  origin_mandi: string;
  destination_city: string;
  delivery_otp: string;
  inspection_passed: boolean;
  created_at: string;
  updated_at: string;
}

export interface FpoPool {
  fpo_id: string;
  fpo_name: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  target_quantity_q: number;
  current_quantity_q: number;
  member_farmers_count: number;
  collective_base_price_per_q: number;
  estimated_buyer_premium_pct: number;
  status: string;
  created_at: string;
}

export interface BuyerDemand {
  demand_id: string;
  buyer_name: string;
  company_name: string;
  buyer_type: string;
  commodity: string;
  variety?: string;
  required_grade: QualityGrade;
  quantity_needed_q: number;
  target_price_per_q: number;
  delivery_location: string;
  max_radius_km: number;
  status: string;
  posted_at: string;
}

export interface LedgerBlock {
  block_index: number;
  timestamp: string;
  event_type: string;
  order_id: string;
  lot_id: string;
  actor: string;
  payload_summary: string;
  previous_hash: string;
  block_hash: string;
}

export interface VoiceQueryResponse {
  query: string;
  detected_intent: string;
  detected_crop: string;
  language: string;
  speech_response_text: string;
  structured_data?: {
    commodity: string;
    mandi: string;
    current_price: number;
    recommendation: string;
    gain_percent: number;
  };
}
