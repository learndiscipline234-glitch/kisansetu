import React, { useState, useEffect } from 'react';
import { ProduceLot, PriceForecast, TradeOffer, EscrowOrder, QualityGradingResult } from '../types';
import { api } from '../services/api';
import { SaleWindowCard } from '../components/SaleWindowCard';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { MandiArbitrageMap } from '../components/MandiArbitrageMap';
import { CreateLotModal } from '../components/CreateLotModal';
import { EscrowTimeline } from '../components/EscrowTimeline';
import {
  Sprout,
  Plus,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface FarmerDashboardProps {
  onOpenQualityScanner: () => void;
  onOpenVoice: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenQualityScanner,
  onOpenVoice
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCrop]);

  const loadData = async () => {
    setLoading(true);
    const [fc, lotList, orderList] = await Promise.all([
      api.getForecast(selectedCrop),
      api.getLots(),
      api.getOrders()
    ]);
    setForecast(fc);
    setLots(lotList);
    setOrders(orderList);

    if (lotList.length > 0) {
      const offList = await api.getOffersForLot(lotList[0].lot_id);
      setOffers(offList);
    }
    setLoading(false);
  };

  const handleAcceptOffer = async (offerId: string) => {
    const res = await api.acceptOffer(offerId);
    if (res) {
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Welcome & Quick Action Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Farmer Command Center
              </span>
              <span className="text-xs text-emerald-200">Kisan ID: #MH-NSK-99201</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, Rameshwar Patil
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              AI Market Intelligence is tracking <strong>12 agricultural commodities</strong> across 50+ APMC mandis. Avoid distress selling by leveraging AI sale-window timing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>List New Produce</span>
            </button>
            <button
              onClick={onOpenQualityScanner}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Quality Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commodity Quick Switcher Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {['Wheat', 'Onion', 'Tomato', 'Soybean', 'Cotton', 'Mustard', 'Potato', 'Paddy (Basmati)'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCrop === crop
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Top Intelligence Grid: AI Sale Window + ML Price Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <SaleWindowCard forecast={forecast} />
        </div>
        <div className="lg:col-span-7">
          <PriceTrendChart forecast={forecast} />
        </div>
      </div>

      {/* Mandi Arbitrage Map / Routes */}
      <MandiArbitrageMap
        sourceMandiId="MH-NAS-01"
        sourceMandiName="Lasalgaon APMC (Nashik)"
        commodity={selectedCrop}
      />

      {/* Active Escrow Orders Tracker */}
      {orders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Active Smart Escrow Settlements & Logistics</span>
          </h2>
          {orders.map((ord) => (
            <EscrowTimeline key={ord.order_id} order={ord} onOrderUpdated={loadData} userRole="farmer" />
          ))}
        </div>
      )}

      {/* My Active Lots & Incoming Bids */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">
              My Active Produce Lots & Buyer Offers
            </h2>
            <p className="text-xs text-slate-500">
              Direct farm-gate listings with verified digital quality certificates
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Produce Lot</span>
          </button>
        </div>

        {lots.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active produce lots listed yet. Click "List New Produce" above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lots.map((lot) => (
              <div
                key={lot.lot_id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition space-y-3 shadow-2xs"
              >
                {/* Lot Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{lot.commodity}</span>
                      <span className="text-xs text-slate-500 font-medium">({lot.variety})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        lot.quality_grade === 'Grade A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {lot.quality_grade}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{lot.mandi_nearby} • {lot.district}, {lot.state}</span>
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lot.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lot.status === 'IN_ESCROW'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lot.status}
                  </span>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Quantity</span>
                    <span className="font-black text-slate-800">{lot.quantity_quintals} Q</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Base Price</span>
                    <span className="font-black text-slate-800">₹{lot.base_price_per_q}/Q</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Highest Bid</span>
                    <span className="font-black text-emerald-700">
                      {lot.highest_bid_per_q ? `₹${lot.highest_bid_per_q}/Q` : 'None yet'}
                    </span>
                  </div>
                </div>

                {/* Digital Certificate Hash */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span className="flex items-center space-x-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lot.certificate_hash}</span>
                  </span>
                  <span className="text-emerald-700 font-semibold font-sans">
                    {lot.active_bids_count} Active Bids
                  </span>
                </div>

                {/* Offer Action Box */}
                {lot.active_bids_count > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-950">
                        Top Offer from Verified Buyer
                      </span>
                      <span className="font-black text-emerald-800">
                        ₹{(lot.highest_bid_per_q || lot.base_price_per_q) * lot.quantity_quintals} Total
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAcceptOffer('OFF-2026-01')}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Accept Binding Offer
                      </button>
                      <button
                        onClick={() => alert('Counter offer dialog: Specify price per quintal')}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50"
                      >
                        Counter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produce Listing Wizard Modal */}
      <CreateLotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLotCreated={(newLot) => {
          setLots(prev => [newLot, ...prev]);
        }}
      />
    </div>
  );
};
