from typing import List, Dict, Any, Optional
from datetime import datetime

class DataStore:
    def __init__(self):
        self.lots: List[Dict[str, Any]] = []
        self.fpo_pools: List[Dict[str, Any]] = []
        self.demands: List[Dict[str, Any]] = []
        self.offers: List[Dict[str, Any]] = []
        self.grievances: List[Dict[str, Any]] = []
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Seed realistic farmer produce lots
        self.lots = [
            {
                "lot_id": "LOT-2026-101",
                "farmer_name": "Balwinder Singh",
                "farmer_phone": "+91 98140 33219",
                "state": "Punjab",
                "district": "Ludhiana",
                "mandi_nearby": "Khanna Grain Market (Asia's Largest)",
                "lat": 30.7071,
                "lng": 76.2163,
                "commodity": "Wheat",
                "variety": "HD-2967 Sharbati",
                "quantity_quintals": 120.0,
                "base_price_per_q": 2550.0,
                "quality_grade": "Grade A",
                "quality_metrics": {
                    "uniformity_score": 95.2,
                    "defect_percentage": 1.8,
                    "estimated_moisture_pct": 10.2,
                    "color_vibrancy_score": 92.0
                },
                "certificate_hash": "CERT-QS-88A92B104F",
                "images": ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"],
                "is_fpo_pooled": True,
                "fpo_id": "FPO-PUN-01",
                "created_at": "2026-08-30 10:15 AM",
                "status": "AVAILABLE",
                "active_bids_count": 2,
                "highest_bid_per_q": 2620.0
            },
            {
                "lot_id": "LOT-2026-102",
                "farmer_name": "Dnyaneshwar Jadhav",
                "farmer_phone": "+91 94220 88910",
                "state": "Maharashtra",
                "district": "Nashik",
                "mandi_nearby": "Lasalgaon APMC",
                "lat": 20.1472,
                "lng": 74.2272,
                "commodity": "Onion",
                "variety": "Red Garwa Onion",
                "quantity_quintals": 180.0,
                "base_price_per_q": 2400.0,
                "quality_grade": "Grade A",
                "quality_metrics": {
                    "uniformity_score": 93.8,
                    "defect_percentage": 2.4,
                    "estimated_moisture_pct": 11.0,
                    "color_vibrancy_score": 89.5
                },
                "certificate_hash": "CERT-QS-99C12E44A1",
                "images": ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80"],
                "is_fpo_pooled": False,
                "fpo_id": None,
                "created_at": "2026-08-30 11:45 AM",
                "status": "AVAILABLE",
                "active_bids_count": 3,
                "highest_bid_per_q": 2510.0
            },
            {
                "lot_id": "LOT-2026-103",
                "farmer_name": "Suresh Patel",
                "farmer_phone": "+91 97123 55401",
                "state": "Madhya Pradesh",
                "district": "Indore",
                "mandi_nearby": "Chhawani Mandi",
                "lat": 22.7196,
                "lng": 75.8577,
                "commodity": "Soybean",
                "variety": "JS-9560 Clean Bold",
                "quantity_quintals": 85.0,
                "base_price_per_q": 4850.0,
                "quality_grade": "Grade B",
                "quality_metrics": {
                    "uniformity_score": 84.5,
                    "defect_percentage": 5.2,
                    "estimated_moisture_pct": 12.1,
                    "color_vibrancy_score": 78.0
                },
                "certificate_hash": "CERT-QS-44B91D22E8",
                "images": ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80"],
                "is_fpo_pooled": True,
                "fpo_id": "FPO-MAL-02",
                "created_at": "2026-08-29 04:20 PM",
                "status": "OFFER_RECEIVED",
                "active_bids_count": 1,
                "highest_bid_per_q": 4920.0
            },
            {
                "lot_id": "LOT-2026-104",
                "farmer_name": "Manjunath Gowda",
                "farmer_phone": "+91 98450 77123",
                "state": "Karnataka",
                "district": "Kolar",
                "mandi_nearby": "Kolar Tomato Market",
                "lat": 13.1378,
                "lng": 78.1291,
                "commodity": "Tomato",
                "variety": "Himsona Hybrid Firm",
                "quantity_quintals": 95.0,
                "base_price_per_q": 1850.0,
                "quality_grade": "Grade A",
                "quality_metrics": {
                    "uniformity_score": 96.0,
                    "defect_percentage": 1.5,
                    "estimated_moisture_pct": 91.0,
                    "color_vibrancy_score": 95.0
                },
                "certificate_hash": "CERT-QS-77F81B33CC",
                "images": ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"],
                "is_fpo_pooled": False,
                "fpo_id": None,
                "created_at": "2026-08-31 06:30 AM",
                "status": "AVAILABLE",
                "active_bids_count": 4,
                "highest_bid_per_q": 1960.0
            }
        ]

        # Seed FPO Pools
        self.fpo_pools = [
            {
                "fpo_id": "FPO-PUN-01",
                "fpo_name": "Malwa Progressive Farmers Producer Co.",
                "district": "Ludhiana",
                "state": "Punjab",
                "commodity": "Wheat",
                "variety": "HD-2967 Premium Sharbati",
                "target_quantity_q": 500.0,
                "current_quantity_q": 380.0,
                "member_farmers_count": 18,
                "collective_base_price_per_q": 2580.0,
                "estimated_buyer_premium_pct": 6.5,
                "status": "AGGREGATING",
                "created_at": "2026-08-25"
            },
            {
                "fpo_id": "FPO-MAL-02",
                "fpo_name": "Sahyadri Agro Federation FPO",
                "district": "Nashik",
                "state": "Maharashtra",
                "commodity": "Onion",
                "variety": "Red Garwa Export Grade",
                "target_quantity_q": 1000.0,
                "current_quantity_q": 820.0,
                "member_farmers_count": 42,
                "collective_base_price_per_q": 2550.0,
                "estimated_buyer_premium_pct": 8.0,
                "status": "BIDDING_OPEN",
                "created_at": "2026-08-22"
            }
        ]

        # Seed Buyer Demands
        self.demands = [
            {
                "demand_id": "DEM-2026-01",
                "buyer_name": "ITC Agri Business Division",
                "company_name": "ITC Limited",
                "buyer_type": "Processor",
                "commodity": "Wheat",
                "variety": "Sharbati / HD-2967",
                "required_grade": "Grade A",
                "quantity_needed_q": 500.0,
                "target_price_per_q": 2650.0,
                "delivery_location": "ITC Hub, Indore",
                "max_radius_km": 400.0,
                "status": "OPEN",
                "posted_at": "2026-08-29"
            },
            {
                "demand_id": "DEM-2026-02",
                "buyer_name": "PepsiCo Frito-Lay",
                "company_name": "PepsiCo India",
                "buyer_type": "Processor",
                "commodity": "Potato",
                "variety": "Chipsona-1",
                "required_grade": "Grade A",
                "quantity_needed_q": 800.0,
                "target_price_per_q": 1650.0,
                "delivery_location": "PepsiCo Plant, Agra",
                "max_radius_km": 500.0,
                "status": "OPEN",
                "posted_at": "2026-08-30"
            }
        ]

        # Seed initial trade offers
        self.offers = [
            {
                "offer_id": "OFF-2026-01",
                "lot_id": "LOT-2026-101",
                "buyer_name": "ITC Agri Business Division",
                "buyer_company": "ITC Limited",
                "buyer_rating": 4.9,
                "offered_price_per_q": 2620.0,
                "total_amount": 314400.0,
                "message": "We require immediate dispatch to our Ludhiana warehouse. 100% Escrow deposit guaranteed.",
                "status": "PENDING",
                "created_at": "2026-08-30 02:15 PM"
            },
            {
                "offer_id": "OFF-2026-02",
                "lot_id": "LOT-2026-102",
                "buyer_name": "Reliance Retail Fresh",
                "buyer_company": "Reliance Retail Ltd",
                "buyer_rating": 4.85,
                "offered_price_per_q": 2510.0,
                "total_amount": 451800.0,
                "message": "Grade A verified quality. Pickup directly from Lasalgaon APMC yard.",
                "status": "PENDING",
                "created_at": "2026-08-30 04:30 PM"
            }
        ]

        # Seed Grievance record
        self.grievances = [
            {
                "grievance_id": "GRV-2026-091",
                "order_id": "ORD-2026-8812",
                "filed_by": "Rameshwar Patil (Farmer)",
                "issue_type": "Transporter Delay",
                "description": "Truck driver arrived 3 hours late at Lasalgaon pickup point due to toll congestion.",
                "evidence_images": [],
                "status": "RESOLVED",
                "created_at": "2026-08-28 01:15 PM",
                "resolution_notes": "AgriLink Logistics updated ETA and waived secondary loading charges."
            }
        ]

    # Helper operations
    def create_lot(self, lot_data: Dict[str, Any]) -> Dict[str, Any]:
        lot_id = f"LOT-2026-{len(self.lots) + 101}"
        lot_data["lot_id"] = lot_id
        lot_data["created_at"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        lot_data["status"] = "AVAILABLE"
        lot_data["active_bids_count"] = 0
        lot_data["highest_bid_per_q"] = None
        self.lots.insert(0, lot_data)
        return lot_data

    def create_offer(self, offer_data: Dict[str, Any]) -> Dict[str, Any]:
        offer_id = f"OFF-2026-{len(self.offers) + 101}"
        offer_data["offer_id"] = offer_id
        offer_data["created_at"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        offer_data["status"] = "PENDING"
        self.offers.insert(0, offer_data)
        
        # update lot active bids count
        for lot in self.lots:
            if lot["lot_id"] == offer_data["lot_id"]:
                lot["active_bids_count"] = lot.get("active_bids_count", 0) + 1
                curr_max = lot.get("highest_bid_per_q") or 0
                if offer_data["offered_price_per_q"] > curr_max:
                    lot["highest_bid_per_q"] = offer_data["offered_price_per_q"]
                lot["status"] = "OFFER_RECEIVED"
                break
        return offer_data

    def create_fpo_pool(self, pool_data: Dict[str, Any]) -> Dict[str, Any]:
        pool_id = f"FPO-POOL-{len(self.fpo_pools) + 101}"
        pool_data["fpo_id"] = pool_id
        pool_data["current_quantity_q"] = pool_data.get("current_quantity_q", 0)
        pool_data["member_farmers_count"] = pool_data.get("member_farmers_count", 1)
        pool_data["status"] = "AGGREGATING"
        pool_data["created_at"] = datetime.now().strftime("%Y-%m-%d")
        self.fpo_pools.insert(0, pool_data)
        return pool_data

    def join_fpo_pool(self, fpo_id: str, quantity_q: float) -> Optional[Dict[str, Any]]:
        for pool in self.fpo_pools:
            if pool["fpo_id"] == fpo_id:
                pool["current_quantity_q"] += quantity_q
                pool["member_farmers_count"] += 1
                if pool["current_quantity_q"] >= pool["target_quantity_q"]:
                    pool["status"] = "TARGET_REACHED_BIDDING_OPEN"
                return pool
        return None

    def post_buyer_demand(self, demand_data: Dict[str, Any]) -> Dict[str, Any]:
        demand_id = f"DEM-2026-{len(self.demands) + 101}"
        demand_data["demand_id"] = demand_id
        demand_data["posted_at"] = datetime.now().strftime("%Y-%m-%d")
        demand_data["status"] = "OPEN"
        self.demands.insert(0, demand_data)
        return demand_data

    def submit_grievance(self, grv_data: Dict[str, Any]) -> Dict[str, Any]:
        grv_id = f"GRV-2026-{len(self.grievances) + 101}"
        grv_data["grievance_id"] = grv_id
        grv_data["status"] = "UNDER_REVIEW"
        grv_data["created_at"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        self.grievances.insert(0, grv_data)
        return grv_data

db = DataStore()
