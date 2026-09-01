import {
  MandiRecord,
  ArbitrageOpportunity,
  PriceForecast,
  ProduceLot,
  QualityGradingResult,
  MatchResult,
  TradeOffer,
  EscrowOrder,
  FpoPool,
  BuyerDemand,
  LedgerBlock,
  VoiceQueryResponse
} from '../types';

const rawApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = rawApiBase ? (rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase.replace(/\/$/, '')}/api`) : '/api';

export const api = {
  // Mandi Prices & Forecasting
  async getPrices(commodity?: string, state?: string, search?: string): Promise<MandiRecord[]> {
    try {
      const params = new URLSearchParams();
      if (commodity && commodity !== 'all') params.append('commodity', commodity);
      if (state && state !== 'all') params.append('state', state);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/prices/all?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      return await res.json();
    } catch (e) {
      console.warn('API fetch failed, returning fallback data', e);
      return [];
    }
  },

  async getForecast(commodity: string = 'Wheat', mandiId?: string): Promise<PriceForecast | null> {
    try {
      const params = new URLSearchParams({ commodity });
      if (mandiId) params.append('mandi_id', mandiId);
      const res = await fetch(`${API_BASE}/prices/forecast?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch forecast');
      return await res.json();
    } catch (e) {
      console.warn('Forecast API error', e);
      return null;
    }
  },

  async getArbitrage(sourceMandiId: string, commodity?: string): Promise<ArbitrageOpportunity[]> {
    try {
      const params = new URLSearchParams({ source_mandi_id: sourceMandiId });
      if (commodity) params.append('commodity', commodity);
      const res = await fetch(`${API_BASE}/prices/arbitrage?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch arbitrage');
      return await res.json();
    } catch (e) {
      console.warn('Arbitrage API error', e);
      return [];
    }
  },

  async getMarketKPIs() {
    try {
      const res = await fetch(`${API_BASE}/prices/kpis`);
      if (!res.ok) throw new Error('Failed to fetch KPIs');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getCommodities(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/prices/commodities`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return ['Wheat', 'Onion', 'Tomato', 'Soybean', 'Cotton', 'Mustard', 'Potato', 'Paddy (Basmati)', 'Turmeric', 'Maize', 'Chana'];
    }
  },

  // AI Quality Grading
  async gradeProducePreset(commodity: string, sampleQuality: string, basePrice?: number): Promise<QualityGradingResult | null> {
    try {
      const params = new URLSearchParams({ commodity, sample_quality: sampleQuality });
      if (basePrice) params.append('base_price', basePrice.toString());
      const res = await fetch(`${API_BASE}/quality/grade-preset?${params.toString()}`, { method: 'POST' });
      if (!res.ok) throw new Error('Grading failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async gradeProduceImage(file: File, commodity: string): Promise<QualityGradingResult | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('commodity', commodity);
      const res = await fetch(`${API_BASE}/quality/grade-image`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Image grading failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Produce Lots & Trading
  async getLots(commodity?: string, grade?: string, fpoOnly?: boolean): Promise<ProduceLot[]> {
    try {
      const params = new URLSearchParams();
      if (commodity && commodity !== 'all') params.append('commodity', commodity);
      if (grade && grade !== 'all') params.append('grade', grade);
      if (fpoOnly) params.append('fpo_only', 'true');
      const res = await fetch(`${API_BASE}/lots/all?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createLot(lotData: Partial<ProduceLot>): Promise<ProduceLot | null> {
    try {
      const res = await fetch(`${API_BASE}/lots/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lotData)
      });
      if (!res.ok) throw new Error('Failed to create lot');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getLotMatches(lotId: string): Promise<MatchResult[]> {
    try {
      const res = await fetch(`${API_BASE}/lots/${lotId}/matches`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getOffersForLot(lotId: string): Promise<TradeOffer[]> {
    try {
      const res = await fetch(`${API_BASE}/lots/${lotId}/offers`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async placeOffer(offerData: Partial<TradeOffer>): Promise<TradeOffer | null> {
    try {
      const res = await fetch(`${API_BASE}/lots/offer/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });
      if (!res.ok) throw new Error('Failed to place offer');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async acceptOffer(offerId: string) {
    try {
      const res = await fetch(`${API_BASE}/lots/offer/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offerId })
      });
      if (!res.ok) throw new Error('Failed to accept offer');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // FPO Pools
  async getFpoPools(): Promise<FpoPool[]> {
    try {
      const res = await fetch(`${API_BASE}/fpo/pools`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createFpoPool(poolData: Partial<FpoPool>): Promise<FpoPool | null> {
    try {
      const res = await fetch(`${API_BASE}/fpo/pools/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolData)
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async joinFpoPool(fpoId: string, quantityQ: number, farmerName: string) {
    try {
      const res = await fetch(`${API_BASE}/fpo/pools/${fpoId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity_q: quantityQ, farmer_name: farmerName })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Buyer Demands
  async getDemands(commodity?: string): Promise<BuyerDemand[]> {
    try {
      const params = new URLSearchParams();
      if (commodity && commodity !== 'all') params.append('commodity', commodity);
      const res = await fetch(`${API_BASE}/demands/all?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createDemand(demandData: Partial<BuyerDemand>): Promise<BuyerDemand | null> {
    try {
      const res = await fetch(`${API_BASE}/demands/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demandData)
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Escrow Orders & Ledger
  async getOrders(): Promise<EscrowOrder[]> {
    try {
      const res = await fetch(`${API_BASE}/orders/all`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string, actor: string, notes: string = '') {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actor, notes })
      });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getLedgerHistory(orderId?: string): Promise<LedgerBlock[]> {
    try {
      const params = new URLSearchParams();
      if (orderId) params.append('order_id', orderId);
      const res = await fetch(`${API_BASE}/orders/ledger/history?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Voice & SMS Assistant
  async processVoiceQuery(query: string, language: string = 'hi'): Promise<VoiceQueryResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/assistant/voice-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language })
      });
      if (!res.ok) throw new Error('Voice query failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async simulateSMS(message: string, phoneNumber: string) {
    try {
      const res = await fetch(`${API_BASE}/assistant/sms-simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, phone_number: phoneNumber })
      });
      if (!res.ok) throw new Error('SMS simulation failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Grievance / Disputes
  async submitGrievance(data: any) {
    try {
      const res = await fetch(`${API_BASE}/grievances/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Grievance submission failed');
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
