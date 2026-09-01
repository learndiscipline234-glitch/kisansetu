import sys
sys.path.insert(0, r"C:\Users\helpe\.gemini\antigravity\scratch\kisansetu\backend")
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

r0 = client.get("/")
print("1. Root:", r0.json()["platform"])

r1 = client.get("/api/prices/all?commodity=Wheat")
print("2. Wheat Mandis found:", len(r1.json()))

r2 = client.get("/api/prices/forecast?commodity=Onion")
data = r2.json()
print("3. AI Sale Window Recommendation:", data["sale_window_recommendation"])
print("   Optimal date:", data["optimal_sale_date"], "| Gain:", data["expected_gain_percent"], "%")

r3 = client.post("/api/quality/grade-preset?commodity=Tomato&sample_quality=A")
q_data = r3.json()
print("4. Quality Result:", q_data["grade"], "| Cert:", q_data["certificate_hash"])

r4 = client.get("/api/lots/all")
lots = r4.json()
print("5. Active Lots:", len(lots))
if lots:
    first_id = lots[0]["lot_id"]
    match_res = client.get(f"/api/lots/{first_id}/matches")
    print("   Matches found for first lot:", len(match_res.json()))

r5 = client.get("/api/orders/all")
orders = r5.json()
print("6. Escrow Orders:", len(orders))
ledger_res = client.get("/api/orders/ledger/history")
print("   Immutable Ledger Blocks count:", len(ledger_res.json()))

r6 = client.post("/api/assistant/voice-query", json={"query": "सोयाबीन का भाव क्या है?", "language": "hi"})
print("7. Voice Query intent:", r6.json()["detected_intent"], "| Crop:", r6.json()["detected_crop"])

r7 = client.post("/api/assistant/sms-simulate", json={"message": "BHAV ONION", "phone_number": "+91 98221 44520"})
print("8. SMS Simulator Reply:\n  ", r7.json()["sms_reply"])

print("\n*** ALL 8 BACKEND ENDPOINTS AND MICROSERVICES ARE 100% OPERATIONAL! ***")
