import React, { useState, useEffect } from 'react';
import { ProduceLot, BuyerDemand, EscrowOrder, TradeOffer } from '../types';
import { api } from '../services/api';
import { EscrowTimeline } from '../components/EscrowTimeline';
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  FileCheck2,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  Truck
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [demands, setDemands] = useState<BuyerDemand[]>([]);
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [fpoOnly, setFpoOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Bidding modal state
  const [activeLotForBid, setActiveLotForBid] = useState<ProduceLot | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(2600);
  const [bidMessage, setBidMessage] = useState('Ready for immediate dispatch to our warehouse. 100% Escrow deposit guaranteed.');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Post Demand modal state
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [demandCrop, setDemandCrop] = useState('Wheat');
  const [demandGrade, setDemandGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [demandQty, setDemandQty] = useState<number>(500);
  const [demandPrice, setDemandPrice] = useState<number>(2650);

  useEffect(() => {
    loadData();
  }, [selectedCrop, selectedGrade, fpoOnly]);

  const loadData = async () => {
    setLoading(true);
    const [allLots, allDemands, allOrders] = await Promise.all([
      api.getLots(selectedCrop, selectedGrade, fpoOnly),
      api.getDemands(),
      api.getOrders()
    ]);
    setLots(allLots);
    setDemands(allDemands);
    setOrders(allOrders);
    setLoading(false);
  };

  const handlePlaceBid = async () => {
    if (!activeLotForBid) return;
    setIsSubmittingBid(true);

    const offerData: Partial<TradeOffer> = {
      lot_id: activeLotForBid.lot_id,
      buyer_name: 'ITC Agri Business Division',
      buyer_company: 'ITC Limited',
      buyer_rating: 4.9,
      offered_price_per_q: Number(bidPrice),
      total_amount: activeLotForBid.quantity_quintals * Number(bidPrice),
      message: bidMessage
    };

    const res = await api.placeOffer(offerData);
    setIsSubmittingBid(false);
    if (res) {
      alert(`Offer placed successfully for Lot #${activeLotForBid.lot_id}! Farmer notified.`);
      setActiveLotForBid(null);
      loadData();
    }
  };

  const handleCreateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createDemand({
      buyer_name: 'ITC Agri Business Division',
      company_name: 'ITC Limited',
      buyer_type: 'Processor',
      commodity: demandCrop,
      required_grade: demandGrade,
      quantity_needed_q: Number(demandQty),
      target_price_per_q: Number(demandPrice),
      delivery_location: 'Central Processing Hub',
      max_radius_km: 500
    });
    if (res) {
      setDemands(prev => [res, ...prev]);
      setIsDemandModalOpen(false);
    }
  };

  const filteredLots = lots.filter(lot => {
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        lot.commodity.toLowerCase().includes(s) ||
        lot.district.toLowerCase().includes(s) ||
        lot.farmer_name.toLowerCase().includes(s) ||
        lot.mandi_nearby.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Buyer Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Verified Institutional Buyer Portal
              </span>
              <span className="text-xs text-emerald-300">GSTIN: 27AAACI1681G1Z1 • Grade A Sourcing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              ITC Agri Business Procurement Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Source standardized, AI quality-certified produce directly from smallholder farmers & FPO aggregations with guaranteed Escrow settlement.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsDemandModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post Procurement Demand (RFP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders In Escrow / Fulfillment */}
      {orders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Active Procurement Orders & Escrow Vaults</span>
          </h2>
          {orders.map((ord) => (
            <EscrowTimeline key={ord.order_id} order={ord} onOrderUpdated={loadData} userRole="buyer" />
          ))}
        </div>
      )}

      {/* Active RFP Demands Carousel / Row */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Active Buyer Demands (RFPs)</h3>
            <p className="text-xs text-slate-500">Farmers matching these demands receive instant push notifications</p>
          </div>
          <button
            onClick={() => setIsDemandModalOpen(true)}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            + Post New Demand
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {demands.map((d) => (
            <div key={d.demand_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-sm">{d.commodity} ({d.required_grade})</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {d.status}
                </span>
              </div>
              <p className="text-slate-600 font-medium text-[11px]">{d.buyer_name}</p>
              <div className="flex justify-between text-slate-700 bg-white p-2 rounded-lg border border-slate-100 font-semibold">
                <span>Quantity: {d.quantity_needed_q} Q</span>
                <span className="text-emerald-700">Max: ₹{d.target_price_per_q}/Q</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Produce Marketplace Catalog */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Verified Farmer Produce Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Browse lots with tamper-proof computer vision quality grading
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crop, district, farmer..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Crop filter */}
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="all">All Crops</option>
              <option value="Wheat">Wheat</option>
              <option value="Onion">Onion</option>
              <option value="Tomato">Tomato</option>
              <option value="Soybean">Soybean</option>
              <option value="Cotton">Cotton</option>
              <option value="Potato">Potato</option>
            </select>

            {/* Grade filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="all">All Grades</option>
              <option value="Grade A">Grade A (Premium)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Commercial)</option>
            </select>

            {/* FPO Bulk toggle */}
            <button
              onClick={() => setFpoOnly(!fpoOnly)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition flex items-center space-x-1.5 ${
                fpoOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>FPO Bulk Lots Only</span>
            </button>
          </div>
        </div>

        {/* Lots Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading verified lots...</div>
        ) : filteredLots.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No lots found matching current criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLots.map((lot) => (
              <div
                key={lot.lot_id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Image & Badge */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={lot.images[0]}
                    alt={lot.commodity}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm text-white ${
                      lot.quality_grade === 'Grade A'
                        ? 'bg-emerald-600'
                        : lot.quality_grade === 'Grade B'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}>
                      {lot.quality_grade}
                    </span>
                    {lot.is_fpo_pooled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow-sm flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>FPO Pooled</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                    {lot.certificate_hash}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {lot.commodity} <span className="font-normal text-slate-500">({lot.variety})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lot.district}, {lot.state} • {lot.mandi_nearby}</span>
                        </p>
                      </div>
                      <span className="text-right font-black text-emerald-700 text-sm">
                        ₹{lot.base_price_per_q}/Q
                      </span>
                    </div>

                    {/* Metrics pill */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-50 p-2 rounded-lg mt-3 border border-slate-100 font-semibold">
                      <div>
                        <span className="text-slate-400 block font-normal">Available</span>
                        <span className="text-slate-800 font-bold">{lot.quantity_quintals} Q</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-normal">Uniformity</span>
                        <span className="text-emerald-700 font-bold">{lot.quality_metrics.uniformity_score}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-normal">Defect Ratio</span>
                        <span className="text-slate-800 font-bold">{lot.quality_metrics.defect_percentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Bid Button */}
                  <button
                    onClick={() => {
                      setActiveLotForBid(lot);
                      setBidPrice(lot.base_price_per_q);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Place Binding Bid / Buy Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Place Bid Modal */}
      {activeLotForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900">
              Submit Digital Offer for Lot #{activeLotForBid.lot_id}
            </h3>
            <p className="text-slate-500">
              {activeLotForBid.quantity_quintals} Quintals of {activeLotForBid.quality_grade} {activeLotForBid.commodity} from {activeLotForBid.farmer_name}
            </p>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Offered Price per Quintal (₹)</label>
              <input
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950">
              <span>Total Escrow Commitment:</span>
              <span className="text-emerald-800 font-black text-sm">
                ₹{(activeLotForBid.quantity_quintals * bidPrice).toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Terms / Message for Farmer</label>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={handlePlaceBid}
                disabled={isSubmittingBid}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
              >
                {isSubmittingBid ? "Submitting Offer..." : "Confirm & Deposit into Escrow"}
              </button>
              <button
                onClick={() => setActiveLotForBid(null)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Demand RFP Modal */}
      {isDemandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900">Post Institutional Demand (RFP)</h3>
            <p className="text-slate-500">Farmers matching this specification will be notified automatically.</p>

            <form onSubmit={handleCreateDemand} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Commodity</label>
                <select
                  value={demandCrop}
                  onChange={(e) => setDemandCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Potato">Potato</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Grade</label>
                  <select
                    value={demandGrade}
                    onChange={(e) => setDemandGrade(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity (Q)</label>
                  <input
                    type="number"
                    value={demandQty}
                    onChange={(e) => setDemandQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Procurement Price (₹/Q)</label>
                <input
                  type="number"
                  value={demandPrice}
                  onChange={(e) => setDemandPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-emerald-800"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  Publish Procurement Demand
                </button>
                <button
                  type="button"
                  onClick={() => setIsDemandModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
