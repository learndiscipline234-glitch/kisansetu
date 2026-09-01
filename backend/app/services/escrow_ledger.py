import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

class ImmutableLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis_block = {
            "block_index": 0,
            "timestamp": "2026-08-01T00:00:00Z",
            "event_type": "GENESIS_ROOT",
            "order_id": "SYSTEM_ROOT",
            "lot_id": "SYSTEM_ROOT",
            "actor": "KisanSetu Trust Authority",
            "payload_summary": "KisanSetu Immutable Agricultural Trade Ledger Initialized",
            "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "block_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }
        self.chain.append(genesis_block)

    def record_event(self, event_type: str, order_id: str, lot_id: str, actor: str, payload_summary: str) -> Dict[str, Any]:
        prev_block = self.chain[-1]
        prev_hash = prev_block["block_hash"]
        idx = len(self.chain)
        timestamp = datetime.now().isoformat()
        
        raw_string = f"{idx}:{timestamp}:{event_type}:{order_id}:{lot_id}:{actor}:{payload_summary}:{prev_hash}"
        curr_hash = hashlib.sha256(raw_string.encode()).hexdigest()
        
        block = {
            "block_index": idx,
            "timestamp": timestamp,
            "event_type": event_type,
            "order_id": order_id,
            "lot_id": lot_id,
            "actor": actor,
            "payload_summary": payload_summary,
            "previous_hash": prev_hash,
            "block_hash": curr_hash
        }
        self.chain.append(block)
        return block

    def get_ledger_history(self, order_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if order_id:
            return [b for b in self.chain if b.get("order_id") == order_id or b.get("order_id") == "SYSTEM_ROOT"]
        return list(reversed(self.chain))

class EscrowService:
    def __init__(self, ledger: ImmutableLedger):
        self.ledger = ledger
        self.orders: Dict[str, Dict[str, Any]] = {}
        self._seed_sample_orders()

    def _seed_sample_orders(self):
        sample_order = {
            "order_id": "ORD-2026-8812",
            "lot_id": "LOT-NAS-901",
            "offer_id": "OFF-ITC-441",
            "farmer_name": "Rameshwar Patil (Nashik FPO)",
            "farmer_phone": "+91 98221 44520",
            "buyer_name": "ITC Agri Business Division",
            "commodity": "Onion",
            "variety": "Red Onion Grade A",
            "quantity_quintals": 250.0,
            "price_per_q": 2450.0,
            "total_amount": 612500.0,
            "escrow_status": "IN_TRANSIT",
            "tracking_number": "TRK-AGRI-9920",
            "transporter_name": "Kisan Express Logistics (MH-15-EG-4402)",
            "origin_mandi": "Lasalgaon APMC, Nashik",
            "destination_city": "ITC Processing Plant, Indore",
            "delivery_otp": "749201",
            "inspection_passed": False,
            "created_at": "2026-08-28 09:30 AM",
            "updated_at": "2026-08-30 02:15 PM"
        }
        self.orders[sample_order["order_id"]] = sample_order
        self.ledger.record_event("LOT_CREATED", sample_order["order_id"], sample_order["lot_id"], sample_order["farmer_name"], "250 Quintals Grade A Red Onion listed at ₹2,450/Q")
        self.ledger.record_event("OFFER_ACCEPTED", sample_order["order_id"], sample_order["lot_id"], sample_order["farmer_name"], "Accepted binding offer of ₹6,12,500 from ITC Agri Business")
        self.ledger.record_event("ESCROW_DEPOSITED", sample_order["order_id"], sample_order["lot_id"], sample_order["buyer_name"], "₹6,12,500 locked in KisanSetu Smart Escrow Vault (SBI Escrow Account #...8921)")
        self.ledger.record_event("LOGISTICS_DISPATCHED", sample_order["order_id"], sample_order["lot_id"], sample_order["transporter_name"], "Loaded truck dispatched from Lasalgaon APMC. GPS tracking active.")

    def create_order_from_accepted_offer(self, lot: Dict[str, Any], offer: Dict[str, Any]) -> Dict[str, Any]:
        order_id = f"ORD-2026-{len(self.orders) + 8813}"
        total_amount = offer.get("total_amount", lot["quantity_quintals"] * offer["offered_price_per_q"])
        
        order = {
            "order_id": order_id,
            "lot_id": lot["lot_id"],
            "offer_id": offer["offer_id"],
            "farmer_name": lot["farmer_name"],
            "farmer_phone": lot["farmer_phone"],
            "buyer_name": offer["buyer_name"],
            "commodity": lot["commodity"],
            "variety": lot["variety"],
            "quantity_quintals": lot["quantity_quintals"],
            "price_per_q": offer["offered_price_per_q"],
            "total_amount": total_amount,
            "escrow_status": "DEPOSITED",
            "tracking_number": f"TRK-AGRI-{len(self.orders) + 9921}",
            "transporter_name": "AgriLink Express Logistics",
            "origin_mandi": lot.get("mandi_nearby", "Local Mandi"),
            "destination_city": "Buyer Central Warehouse",
            "delivery_otp": "583920",
            "inspection_passed": False,
            "created_at": datetime.now().strftime("%Y-%m-%d %I:%M %p"),
            "updated_at": datetime.now().strftime("%Y-%m-%d %I:%M %p")
        }
        self.orders[order_id] = order
        
        self.ledger.record_event("OFFER_ACCEPTED", order_id, lot["lot_id"], lot["farmer_name"], f"Accepted digital offer of ₹{total_amount:,.2f} from {offer['buyer_name']}")
        self.ledger.record_event("ESCROW_DEPOSITED", order_id, lot["lot_id"], offer["buyer_name"], f"₹{total_amount:,.2f} deposited into Escrow Vault")
        
        return order

    def update_order_status(self, order_id: str, new_status: str, actor: str, notes: str = "") -> Optional[Dict[str, Any]]:
        order = self.orders.get(order_id)
        if not order:
            return None
        
        order["escrow_status"] = new_status
        order["updated_at"] = datetime.now().strftime("%Y-%m-%d %I:%M %p")
        if new_status == "INSPECTION_VERIFIED" or new_status == "RELEASED":
            order["inspection_passed"] = True
            
        self.orders[order_id] = order
        
        event_name = new_status
        summary = f"Order status changed to {new_status}. {notes}".strip()
        if new_status == "RELEASED":
            summary = f"₹{order['total_amount']:,.2f} released directly to farmer bank account ({order['farmer_name']}) via instant IMPS/UPI."
            
        self.ledger.record_event(event_name, order_id, order["lot_id"], actor, summary)
        return order

    def get_all_orders(self) -> List[Dict[str, Any]]:
        return list(self.orders.values())

    def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        return self.orders.get(order_id)

ledger_service = ImmutableLedger()
escrow_service = EscrowService(ledger_service)
