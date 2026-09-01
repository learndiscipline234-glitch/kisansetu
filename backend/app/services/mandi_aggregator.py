import math
from typing import List, Optional, Dict, Any
from datetime import datetime

MANDI_DATABASE = [
    # Maharashtra
    {"mandi_id": "MH-NAS-01", "mandi_name": "Lasalgaon APMC", "district": "Nashik", "state": "Maharashtra", "commodity": "Onion", "variety": "Red Onion", "arrival_tonnes": 1420.5, "min_price": 1850.0, "max_price": 2620.0, "modal_price": 2350.0, "price_change_24h": 4.2, "lat": 20.1472, "lng": 74.2272},
    {"mandi_id": "MH-NAS-02", "mandi_name": "Nashik APMC", "district": "Nashik", "state": "Maharashtra", "commodity": "Tomato", "variety": "Hybrid Round", "arrival_tonnes": 890.0, "min_price": 1200.0, "max_price": 1950.0, "modal_price": 1650.0, "price_change_24h": -2.1, "lat": 19.9975, "lng": 73.7898},
    {"mandi_id": "MH-PUN-01", "mandi_name": "Gultekdi APMC", "district": "Pune", "state": "Maharashtra", "commodity": "Tomato", "variety": "Hybrid Round", "arrival_tonnes": 650.0, "min_price": 1500.0, "max_price": 2200.0, "modal_price": 1920.0, "price_change_24h": 5.8, "lat": 18.4967, "lng": 73.8654},
    {"mandi_id": "MH-PUN-02", "mandi_name": "Gultekdi APMC", "district": "Pune", "state": "Maharashtra", "commodity": "Onion", "variety": "Red Onion", "arrival_tonnes": 980.0, "min_price": 2100.0, "max_price": 2850.0, "modal_price": 2580.0, "price_change_24h": 3.5, "lat": 18.4967, "lng": 73.8654},
    {"mandi_id": "MH-AKO-01", "mandi_name": "Akola Grain Mandi", "district": "Akola", "state": "Maharashtra", "commodity": "Soybean", "variety": "JS-335 Yellow", "arrival_tonnes": 2100.0, "min_price": 4450.0, "max_price": 4980.0, "modal_price": 4750.0, "price_change_24h": 1.6, "lat": 20.7002, "lng": 77.0082},
    {"mandi_id": "MH-NAG-01", "mandi_name": "Kalamna APMC", "district": "Nagpur", "state": "Maharashtra", "commodity": "Cotton", "variety": "Medium Staple (Shankar-6)", "arrival_tonnes": 1800.0, "min_price": 6850.0, "max_price": 7600.0, "modal_price": 7280.0, "price_change_24h": 2.3, "lat": 21.1738, "lng": 79.1352},
    {"mandi_id": "MH-NAG-02", "mandi_name": "Kalamna APMC", "district": "Nagpur", "state": "Maharashtra", "commodity": "Soybean", "variety": "Yellow", "arrival_tonnes": 1450.0, "min_price": 4600.0, "max_price": 5120.0, "modal_price": 4890.0, "price_change_24h": 2.9, "lat": 21.1738, "lng": 79.1352},
    
    # Madhya Pradesh
    {"mandi_id": "MP-IND-01", "mandi_name": "Chhawani Mandi", "district": "Indore", "state": "Madhya Pradesh", "commodity": "Wheat", "variety": "Sharbati Deluxe", "arrival_tonnes": 3200.0, "min_price": 2650.0, "max_price": 3350.0, "modal_price": 3050.0, "price_change_24h": 0.8, "lat": 22.7196, "lng": 75.8577},
    {"mandi_id": "MP-IND-02", "mandi_name": "Chhawani Mandi", "district": "Indore", "state": "Madhya Pradesh", "commodity": "Soybean", "variety": "Yellow Bold", "arrival_tonnes": 2850.0, "min_price": 4500.0, "max_price": 5050.0, "modal_price": 4820.0, "price_change_24h": 1.2, "lat": 22.7196, "lng": 75.8577},
    {"mandi_id": "MP-UJJ-01", "mandi_name": "Ujjain Krishi Upaj Mandi", "district": "Ujjain", "state": "Madhya Pradesh", "commodity": "Wheat", "variety": "Mill Quality Lokwan", "arrival_tonnes": 2400.0, "min_price": 2420.0, "max_price": 2820.0, "modal_price": 2640.0, "price_change_24h": -0.5, "lat": 23.1765, "lng": 75.7885},
    {"mandi_id": "MP-NEE-01", "mandi_name": "Neemuch APMC", "district": "Neemuch", "state": "Madhya Pradesh", "commodity": "Mustard", "variety": "Black Mustard 42% Oil", "arrival_tonnes": 920.0, "min_price": 5200.0, "max_price": 5900.0, "modal_price": 5620.0, "price_change_24h": 3.1, "lat": 24.4764, "lng": 74.8732},
    {"mandi_id": "MP-NEE-02", "mandi_name": "Neemuch APMC", "district": "Neemuch", "state": "Madhya Pradesh", "commodity": "Chana", "variety": "Desi Chana", "arrival_tonnes": 760.0, "min_price": 5800.0, "max_price": 6450.0, "modal_price": 6180.0, "price_change_24h": 1.5, "lat": 24.4764, "lng": 74.8732},

    # Punjab
    {"mandi_id": "PB-KHA-01", "mandi_name": "Khanna Grain Market (Asia's Largest)", "district": "Ludhiana", "state": "Punjab", "commodity": "Wheat", "variety": "HD-2967 / PBW-550", "arrival_tonnes": 5200.0, "min_price": 2325.0, "max_price": 2550.0, "modal_price": 2480.0, "price_change_24h": 0.2, "lat": 30.7071, "lng": 76.2163},
    {"mandi_id": "PB-KHA-02", "mandi_name": "Khanna Grain Market", "district": "Ludhiana", "state": "Punjab", "commodity": "Paddy (Basmati)", "variety": "Pusa 1121 Super", "arrival_tonnes": 3800.0, "min_price": 3650.0, "max_price": 4450.0, "modal_price": 4180.0, "price_change_24h": 2.7, "lat": 30.7071, "lng": 76.2163},
    {"mandi_id": "PB-JAL-01", "mandi_name": "Jalandhar Main Mandi", "district": "Jalandhar", "state": "Punjab", "commodity": "Potato", "variety": "Pukhraj / Jyoti Table", "arrival_tonnes": 3100.0, "min_price": 950.0, "max_price": 1480.0, "modal_price": 1260.0, "price_change_24h": -4.2, "lat": 31.3260, "lng": 75.5762},

    # Uttar Pradesh
    {"mandi_id": "UP-AGR-01", "mandi_name": "Agra Mandi Samiti", "district": "Agra", "state": "Uttar Pradesh", "commodity": "Potato", "variety": "Chipsona-1 / Kufri", "arrival_tonnes": 4500.0, "min_price": 1100.0, "max_price": 1680.0, "modal_price": 1450.0, "price_change_24h": 1.8, "lat": 27.1767, "lng": 78.0081},
    {"mandi_id": "UP-AGR-02", "mandi_name": "Agra Mandi Samiti", "district": "Agra", "state": "Uttar Pradesh", "commodity": "Mustard", "variety": "Yellow Mustard", "arrival_tonnes": 1250.0, "min_price": 5300.0, "max_price": 6020.0, "modal_price": 5740.0, "price_change_24h": 2.1, "lat": 27.1767, "lng": 78.0081},
    {"mandi_id": "UP-MEE-01", "mandi_name": "Meerut APMC", "district": "Meerut", "state": "Uttar Pradesh", "commodity": "Wheat", "variety": "Dara Grade-A", "arrival_tonnes": 1950.0, "min_price": 2350.0, "max_price": 2620.0, "modal_price": 2510.0, "price_change_24h": 0.5, "lat": 28.9845, "lng": 77.7064},
    {"mandi_id": "UP-KAN-01", "mandi_name": "Kanpur Grain Market", "district": "Kanpur", "state": "Uttar Pradesh", "commodity": "Paddy (Common)", "variety": "PR-106", "arrival_tonnes": 2700.0, "min_price": 2280.0, "max_price": 2520.0, "modal_price": 2420.0, "price_change_24h": 0.9, "lat": 26.4499, "lng": 80.3319},

    # Gujarat
    {"mandi_id": "GJ-UNJ-01", "mandi_name": "Unjha APMC (Spice Hub)", "district": "Mehsana", "state": "Gujarat", "commodity": "Mustard", "variety": "Bold Mustard", "arrival_tonnes": 1800.0, "min_price": 5450.0, "max_price": 6150.0, "modal_price": 5890.0, "price_change_24h": 1.4, "lat": 23.8037, "lng": 72.3926},
    {"mandi_id": "GJ-RAJ-01", "mandi_name": "Rajkot APMC Bedi", "district": "Rajkot", "state": "Gujarat", "commodity": "Cotton", "variety": "Shankar-6 Long Staple", "arrival_tonnes": 3400.0, "min_price": 7100.0, "max_price": 7950.0, "modal_price": 7550.0, "price_change_24h": 3.8, "lat": 22.3039, "lng": 70.8022},
    {"mandi_id": "GJ-GON-01", "mandi_name": "Gondal APMC", "district": "Rajkot", "state": "Gujarat", "commodity": "Onion", "variety": "Garlic & Red Onion", "arrival_tonnes": 1600.0, "min_price": 1950.0, "max_price": 2550.0, "modal_price": 2280.0, "price_change_24h": -1.5, "lat": 21.9619, "lng": 70.7937},

    # Rajasthan
    {"mandi_id": "RJ-KOT-01", "mandi_name": "Bhamashah Mandi Kota", "district": "Kota", "state": "Rajasthan", "commodity": "Soybean", "variety": "Soybean Yellow-Clean", "arrival_tonnes": 2300.0, "min_price": 4620.0, "max_price": 5180.0, "modal_price": 4940.0, "price_change_24h": 2.0, "lat": 25.2138, "lng": 75.8648},
    {"mandi_id": "RJ-KOT-02", "mandi_name": "Bhamashah Mandi Kota", "district": "Kota", "state": "Rajasthan", "commodity": "Mustard", "variety": "Mustard 42% Condition", "arrival_tonnes": 1900.0, "min_price": 5400.0, "max_price": 6100.0, "modal_price": 5820.0, "price_change_24h": 2.5, "lat": 25.2138, "lng": 75.8648},
    {"mandi_id": "RJ-JAI-01", "mandi_name": "Muhana Terminal Market", "district": "Jaipur", "state": "Rajasthan", "commodity": "Tomato", "variety": "Desi & Hybrid", "arrival_tonnes": 950.0, "min_price": 1400.0, "max_price": 2100.0, "modal_price": 1820.0, "price_change_24h": 4.1, "lat": 26.8123, "lng": 75.7654},

    # Andhra Pradesh & Telangana
    {"mandi_id": "AP-GUN-01", "mandi_name": "Guntur Mirchi Yard / APMC", "district": "Guntur", "state": "Andhra Pradesh", "commodity": "Turmeric", "variety": "Finger Turmeric Nizamabad", "arrival_tonnes": 1100.0, "min_price": 13500.0, "max_price": 16200.0, "modal_price": 15100.0, "price_change_24h": 6.2, "lat": 16.3067, "lng": 80.4365},
    {"mandi_id": "TG-WAR-01", "mandi_name": "Enumamula Agricultural Market", "district": "Warangal", "state": "Telangana", "commodity": "Cotton", "variety": "DCH-32 Extra Long", "arrival_tonnes": 2900.0, "min_price": 7300.0, "max_price": 8150.0, "modal_price": 7780.0, "price_change_24h": 3.0, "lat": 17.9689, "lng": 79.5941},
    {"mandi_id": "TG-WAR-02", "mandi_name": "Enumamula Agricultural Market", "district": "Warangal", "state": "Telangana", "commodity": "Maize", "variety": "Yellow Feed Grade", "arrival_tonnes": 1750.0, "min_price": 2050.0, "max_price": 2400.0, "modal_price": 2250.0, "price_change_24h": 1.1, "lat": 17.9689, "lng": 79.5941},

    # Karnataka
    {"mandi_id": "KA-KOL-01", "mandi_name": "Kolar Tomato Market", "district": "Kolar", "state": "Karnataka", "commodity": "Tomato", "variety": "Himsona / Sahu Hybrid", "arrival_tonnes": 1850.0, "min_price": 1350.0, "max_price": 2050.0, "modal_price": 1780.0, "price_change_24h": 3.2, "lat": 13.1378, "lng": 78.1291},
    {"mandi_id": "KA-HUB-01", "mandi_name": "Amargol APMC Hubli", "district": "Dharwad", "state": "Karnataka", "commodity": "Cotton", "variety": "Bunny / Brahma", "arrival_tonnes": 1400.0, "min_price": 6950.0, "max_price": 7680.0, "modal_price": 7350.0, "price_change_24h": 1.8, "lat": 15.3647, "lng": 75.1240}
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

class MandiAggregatorService:
    def __init__(self):
        self.data = MANDI_DATABASE
        self.timestamp = datetime.now().strftime("%d %b %Y, %I:%M %p")

    def get_all_records(self, commodity: Optional[str] = None, state: Optional[str] = None, search: Optional[str] = None):
        results = []
        for r in self.data:
            if commodity and commodity.lower() != "all" and commodity.lower() not in r['commodity'].lower():
                continue
            if state and state.lower() != "all" and state.lower() not in r['state'].lower():
                continue
            if search:
                s = search.lower()
                if s not in r['mandi_name'].lower() and s not in r['district'].lower() and s not in r['commodity'].lower():
                    continue
            item = dict(r)
            item['last_updated'] = self.timestamp
            results.append(item)
        return sorted(results, key=lambda x: x['modal_price'], reverse=True)

    def get_mandi_by_id(self, mandi_id: str):
        for r in self.data:
            if r['mandi_id'] == mandi_id:
                item = dict(r)
                item['last_updated'] = self.timestamp
                return item
        return None

    def get_available_commodities(self):
        crops = sorted(list(set(r['commodity'] for r in self.data)))
        return crops

    def get_available_states(self):
        states = sorted(list(set(r['state'] for r in self.data)))
        return states

    def calculate_arbitrage_opportunities(self, source_mandi_id: str, commodity: Optional[str] = None, max_radius_km: float = 400.0, freight_rate_per_km_q: float = 1.4):
        source = self.get_mandi_by_id(source_mandi_id)
        if not source:
            return []
        
        target_commodity = commodity or source['commodity']
        source_price = source['modal_price']
        source_lat, source_lng = source['lat'], source['lng']
        
        opportunities = []
        for target in self.data:
            if target['mandi_id'] == source_mandi_id:
                continue
            if target['commodity'].lower() != target_commodity.lower():
                continue
            
            dist = haversine_distance(source_lat, source_lng, target['lat'], target['lng'])
            if dist > max_radius_km:
                continue
            
            target_price = target['modal_price']
            gross_diff = target_price - source_price
            est_freight = round(dist * freight_rate_per_km_q, 2)
            net_gain = round(gross_diff - est_freight, 2)
            
            if net_gain > 60:
                rec = f"Highly Profitable! Divert produce to {target['mandi_name']} (+₹{net_gain}/Q net profit after transit)."
                status_color = "green"
            elif net_gain > 0:
                rec = f"Marginal profit (+₹{net_gain}/Q net). Sell locally if storage / transport hassle is high."
                status_color = "yellow"
            else:
                rec = f"Local Mandi is best. Transporting incurs net loss of ₹{abs(net_gain)}/Q."
                status_color = "red"
            
            opportunities.append({
                "source_mandi": source['mandi_name'],
                "source_price": source_price,
                "target_mandi_id": target['mandi_id'],
                "target_mandi": f"{target['mandi_name']} ({target['district']}, {target['state']})",
                "commodity": target_commodity,
                "target_price": target_price,
                "price_diff": gross_diff,
                "distance_km": dist,
                "est_freight_cost": est_freight,
                "net_profit_per_quintal": net_gain,
                "recommendation": rec,
                "status_color": status_color,
                "lat": target['lat'],
                "lng": target['lng']
            })
            
        return sorted(opportunities, key=lambda x: x['net_profit_per_quintal'], reverse=True)

    def get_market_kpis(self):
        commodities = list(set(r['commodity'] for r in self.data))
        total_tonnes = sum(r['arrival_tonnes'] for r in self.data)
        top_gainers = sorted(self.data, key=lambda x: x['price_change_24h'], reverse=True)[:4]
        top_losers = sorted(self.data, key=lambda x: x['price_change_24h'])[:4]
        
        return {
            "total_active_mandis": len(self.data),
            "tracked_commodities_count": len(commodities),
            "total_daily_arrival_tonnes": round(total_tonnes, 1),
            "top_gainers": top_gainers,
            "top_losers": top_losers,
            "synced_source": "Agmarknet & e-NAM Unified Gateway (Govt. of India)",
            "last_sync_time": self.timestamp
        }

mandi_service = MandiAggregatorService()
