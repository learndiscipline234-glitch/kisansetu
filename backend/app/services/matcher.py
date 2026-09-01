from typing import List, Dict, Any
from .mandi_aggregator import haversine_distance

VERIFIED_BUYERS_DIRECTORY = [
    {
        "buyer_id": "BUY-ITC-01",
        "company_name": "ITC Agri Business Division (e-Choupal Network)",
        "buyer_type": "Institutional Food Processor",
        "contact_person": "Rajan Sharma (Senior Procurement Manager)",
        "verified_badge": True,
        "trust_score": 4.9,
        "preferred_commodities": ["Wheat", "Soybean", "Mustard", "Potato"],
        "min_grade": "Grade B",
        "warehouse_location": "Indore, Madhya Pradesh",
        "lat": 22.7196,
        "lng": 75.8577,
        "max_procurement_radius_km": 500,
        "payment_terms": "100% Escrow on Dispatch, Instant Release on Gate Inspection"
    },
    {
        "buyer_id": "BUY-PEP-02",
        "company_name": "PepsiCo India Holdings (Frito-Lay Agro)",
        "buyer_type": "Direct Food Processor",
        "contact_person": "Anita Sengupta (Contract Farming Lead)",
        "verified_badge": True,
        "trust_score": 4.95,
        "preferred_commodities": ["Potato", "Maize", "Tomato"],
        "min_grade": "Grade A",
        "warehouse_location": "Agra / Mathura Hub, Uttar Pradesh",
        "lat": 27.1767,
        "lng": 78.0081,
        "max_procurement_radius_km": 600,
        "payment_terms": "Direct Escrow with Quality Premium Bonus (+8% for Grade A)"
    },
    {
        "buyer_id": "BUY-REL-03",
        "company_name": "Reliance Retail Fresh (Direct Farm Sourcing)",
        "buyer_type": "National Retail Chain",
        "contact_person": "Vikram Patil (Western Zone Agri Head)",
        "verified_badge": True,
        "trust_score": 4.85,
        "preferred_commodities": ["Tomato", "Onion", "Potato", "Paddy (Basmati)"],
        "min_grade": "Grade B",
        "warehouse_location": "Pune & Navi Mumbai Fulfillment Centers",
        "lat": 18.5204,
        "lng": 73.8567,
        "max_procurement_radius_km": 450,
        "payment_terms": "24-Hour Settlement post Digital QR Gate Inspection"
    },
    {
        "buyer_id": "BUY-ADA-04",
        "company_name": "Adani Wilmar (Fortune Edible Oils)",
        "buyer_type": "Agro-Oil & Grain Processor",
        "contact_person": "Hitesh Patel (Oilseeds Procurement)",
        "verified_badge": True,
        "trust_score": 4.8,
        "preferred_commodities": ["Mustard", "Soybean", "Cotton"],
        "min_grade": "Grade B",
        "warehouse_location": "Rajkot / Mehsana, Gujarat",
        "lat": 22.3039,
        "lng": 70.8022,
        "max_procurement_radius_km": 700,
        "payment_terms": "Bank Escrow Guaranteed against Mandi Lot Weight slip"
    },
    {
        "buyer_id": "BUY-KRK-05",
        "company_name": "KRIBHCO Agro Exports Ltd",
        "buyer_type": "Govt-Recognized Commodity Exporter",
        "contact_person": "Sunil Varma (Export Logistics)",
        "verified_badge": True,
        "trust_score": 4.9,
        "preferred_commodities": ["Paddy (Basmati)", "Wheat", "Turmeric", "Chana"],
        "min_grade": "Grade A",
        "warehouse_location": "Karnal / Ludhiana Hub",
        "lat": 30.7071,
        "lng": 76.2163,
        "max_procurement_radius_km": 800,
        "payment_terms": "Irrevocable Digital Letter of Credit / Escrow"
    }
]

class MatchmakerService:
    def __init__(self):
        self.buyers = VERIFIED_BUYERS_DIRECTORY

    def find_matches_for_lot(self, lot: Dict[str, Any]) -> List[Dict[str, Any]]:
        matches = []
        lot_commodity = lot.get("commodity", "")
        lot_grade = lot.get("quality_grade", "Grade B")
        lot_lat = lot.get("lat", 20.0)
        lot_lng = lot.get("lng", 75.0)
        lot_price = lot.get("base_price_per_q", 2000.0)
        is_fpo = lot.get("is_fpo_pooled", False)
        
        grade_weights = {"Grade A": 3, "Grade B": 2, "Grade C": 1}
        lot_grade_val = grade_weights.get(lot_grade, 2)
        
        for b in self.buyers:
            if lot_commodity not in b["preferred_commodities"]:
                continue
            
            buyer_min_grade_val = grade_weights.get(b["min_grade"], 2)
            if lot_grade_val < buyer_min_grade_val:
                continue
            
            dist = haversine_distance(lot_lat, lot_lng, b["lat"], b["lng"])
            if dist > b["max_procurement_radius_km"]:
                continue
            
            # Match scoring formula:
            # Proximity Score (40 pts) + Grade Compatibility (25 pts) + Trust Score (20 pts) + Bulk FPO Bonus (15 pts)
            proximity_score = max(0, 40 - (dist / b["max_procurement_radius_km"]) * 30)
            grade_score = 25 if lot_grade_val >= buyer_min_grade_val else 10
            trust_score = (b["trust_score"] / 5.0) * 20
            fpo_bonus = 15 if is_fpo else 5
            
            total_match_score = min(100, round(proximity_score + grade_score + trust_score + fpo_bonus))
            
            est_offer_price = round(lot_price * (1.03 if lot_grade == "Grade A" else 1.0), 1)
            
            matches.append({
                "buyer": b,
                "distance_km": dist,
                "match_score": total_match_score,
                "match_reasons": [
                    f"Verified high-volume buyer for {lot_commodity}",
                    f"Location within delivery zone ({dist} km from your farm/FPO hub)",
                    f"Requires {b['min_grade']}+ (Your produce is {lot_grade})",
                    "Guaranteed Escrow payment on delivery"
                ],
                "suggested_bid_per_q": est_offer_price
            })
            
        return sorted(matches, key=lambda x: x["match_score"], reverse=True)

matcher_service = MatchmakerService()
