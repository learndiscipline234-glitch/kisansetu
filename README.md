# KisanSetu (किसान सेतु) - Team Shakti

**Smart India Hackathon 2026**
- **Problem Statement ID**: `SIH26132`
- **Problem Statement Title**: *Strengthening market linkages and price discovery for farmers*
- **Theme**: Agriculture, FoodTech & Rural Development
- **Category**: Software
- **Team Name**: Shakti

---

## 🌾 Overview
**KisanSetu** is a unified market-intelligence, AI price discovery, computer-vision quality grading, and direct buyer-farmer transaction platform. It directly eliminates predatory intermediaries and prevents distress selling by combining:

1. **Real-time Price Aggregation**: Ingestion of daily prices & arrival volumes across 50+ APMC mandis synced with Agmarknet and e-NAM protocols.
2. **AI Sale-Window Advisor & Price Trend Forecasting**: Scikit-Learn time-series models generating 30-day forecast trajectories, confidence bounds, distress risk indices, and actionable "Hold vs Sell" recommendations.
3. **Computer Vision Produce Quality Grading**: Automated on-farm produce assessment into Grade A/B/C from mobile camera photos with tamper-proof SHA-256 digital lot certificates.
4. **Verified Farmer-Buyer Direct Marketplace & Matchmaking**: Smart discovery connecting smallholder farmers & FPOs with corporate processors (ITC, PepsiCo, Reliance Fresh).
5. **FPO Collective Lot Pooling**: Enables smallholder farmers to aggregate produce into 500-1000 Quintal bulk lots to unlock 6-8% institutional buyer premiums.
6. **Smart Escrow Contracts & Immutable Audit Ledger**: 100% pre-funded escrow vaults, delivery verification OTP, and cryptographic SHA-256 block ledger tracking every transaction event.
7. **Multilingual Voice & SMS / IVR Gateway**: Voice AI in Hindi, Marathi, Telugu, Punjabi, English, plus interactive feature phone SMS (`BHAV <CROP>`, `HOLD <CROP>`, `STATUS`) and toll-free IVR for low-literacy farmers.
8. **APMC & Government Policy Market Oversight**: Real-time distress selling early warning alerts, market stability indices, and grievance mediation workflows.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide React, Recharts, Canvas-Confetti, Web Speech API.
- **Backend**: Python 3.12/3.14, FastAPI, Uvicorn, Pydantic, Scikit-Learn, NumPy, Pandas, Pillow.
- **Security & Integrity**: SHA-256 Cryptographic Hash Chaining, Role-based Access Control, Escrow Lifecycle State Machine.

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launcher (Windows)
Double-click `start_kisansetu.bat` in the root folder.

### Option 2: Manual Terminal Startup

#### 1. Start the FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 📱 Core Portals & Capabilities

| Portal / Module | Description |
| :--- | :--- |
| **Farmer Portal** | AI Sale-Window Advisor, Quick Produce Listing, AI Photo Grading, My Lots & Incoming Bids, Live Escrow Tracking. |
| **Buyer Portal** | Marketplace Discovery (Filter Grade A/B/C, radius, price), Instant Bidding & Escrow Deposit, RFP Demand Posting. |
| **Mandi Price Intelligence** | 50+ Mandis Live Explorer, 30-Day ML Price Forecasting, Inter-Mandi Freight Arbitrage Net Realization Calculator. |
| **FPO Collective Hub** | Aggregation Pools (500Q-1000Q), Farmer Member Contributions, Collective Payout Estimator. |
| **SMS / IVR Feature Phone** | Interactive Keypad Phone & SMS Simulator for non-smartphone / 2G farmers. |
| **APMC / Govt Oversight** | National Price Stability Index, Distress Selling Warning Alerts, Immutable SHA-256 Transaction Ledger Explorer. |
| **Voice AI Assistant** | Multilingual speech query processing ("बोलकर खोजें" in Hindi, Marathi, Telugu, Punjabi, English). |

---

## 🏆 SIH26132 Compliance Matrix
- [x] Real-time mandi price aggregation from mandis, processors & digital channels.
- [x] AI-based sale-window & price-trend recommendations.
- [x] Verified buyer-farmer matchmaking with digital lot creation.
- [x] Integrated logistics, payment tracking & grievance redressal.
- [x] Localised, multilingual, voice/SMS access for low-literacy farmers.
- [x] AI-driven quality grading reducing subjective on-farm disputes.
- [x] Secure & transparent digital records with cryptographic audit trail.
