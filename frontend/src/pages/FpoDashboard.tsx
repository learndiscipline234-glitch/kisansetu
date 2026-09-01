import React, { useState, useEffect } from 'react';
import { FpoPool } from '../types';
import { api } from '../services/api';
import {
  Users,
  Plus,
  ShieldCheck,
  Award,
  TrendingUp,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Building
} from 'lucide-react';

export const FpoDashboard: React.FC = () => {
  const [pools, setPools] = useState<FpoPool[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<FpoPool | null>(null);
  const [joinQty, setJoinQty] = useState<number>(25);
  const [farmerName, setFarmerName] = useState('Govind Shinde');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New pool modal
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const [newPoolName, setNewPoolName] = useState('Sahyadri Agro Federation FPO');
  const [newCrop, setNewCrop] = useState('Onion');
  const [targetQty, setTargetQty] = useState<number>(1000);
  const [basePrice, setBasePrice] = useState<number>(2550);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    const res = await api.getFpoPools();
    setPools(res);
  };

  const handleJoinPool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPool) return;
    setIsSubmitting(true);

    const res = await api.joinFpoPool(selectedPool.fpo_id, Number(joinQty), farmerName);
    setIsSubmitting(false);

    if (res) {
      alert(`Successfully contributed ${joinQty} Quintals to ${selectedPool.fpo_name}! Estimated payout: ₹${res.estimated_premium_payout.toLocaleString('en-IN')}`);
      setIsJoinModalOpen(false);
      loadPools();
    }
  };

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createFpoPool({
      fpo_name: newPoolName,
      commodity: newCrop,
      target_quantity_q: Number(targetQty),
      collective_base_price_per_q: Number(basePrice),
      district: 'Nashik',
      state: 'Maharashtra',
      estimated_buyer_premium_pct: 7.5
    });

    if (res) {
      setPools(prev => [res, ...prev]);
      setIsCreatePoolOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* FPO Hero */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Farmer Producer Organization (FPO) Hub
              </span>
              <span className="text-xs text-emerald-200">NABARD & SFAC Compliant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              FPO Collective Aggregation & Bargaining Engine
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Eliminate middleman exploitation by pooling produce across smallholder farmers. Form 500-1000 Quintal bulk institutional lots to command <strong>+6% to +8% buyer premiums</strong> from corporate processors.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsCreatePoolOpen(true)}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Bulk Pool</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars of FPO Advantage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-700/50 text-xs">
          <div className="bg-black/20 p-3 rounded-xl">
            <span className="text-amber-300 text-[10px] uppercase font-bold block">Corporate Buyer Premium</span>
            <span className="text-sm font-black">+6.5% to +8.5% Higher Payout</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <span className="text-amber-300 text-[10px] uppercase font-bold block">Logistics Consolidation</span>
            <span className="text-sm font-black">40% Savings on Full-Truckload Freight</span>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <span className="text-amber-300 text-[10px] uppercase font-bold block">Direct Payment Trust</span>
            <span className="text-sm font-black">100% Escrow Bank Split directly to members</span>
          </div>
        </div>
      </div>

      {/* Active Aggregation Pools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Active Collective Aggregation Pools</h2>
            <p className="text-xs text-slate-500">Farmers can contribute individual lots to hit bulk institutional lot sizes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pools.map((pool) => {
            const pct = Math.min(100, Math.round((pool.current_quantity_q / pool.target_quantity_q) * 100));

            return (
              <div
                key={pool.fpo_id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{pool.fpo_name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pool.district}, {pool.state} • {pool.commodity} ({pool.variety})</span>
                      </p>
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      {pool.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 my-3">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Progress: {pool.current_quantity_q} / {pool.target_quantity_q} Quintals</span>
                      <span className="text-emerald-700">{pct}% Aggregated</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Member Farmers</span>
                      <span className="font-black text-slate-900">{pool.member_farmers_count}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Base Price</span>
                      <span className="font-black text-slate-900">₹{pool.collective_base_price_per_q}/Q</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Buyer Premium</span>
                      <span className="font-black text-emerald-700">+{pool.estimated_buyer_premium_pct}%</span>
                    </div>
                  </div>
                </div>

                {/* Join action */}
                <button
                  onClick={() => {
                    setSelectedPool(pool);
                    setIsJoinModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Contribute My Produce to this Pool</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join Pool Modal */}
      {isJoinModalOpen && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900">
              Join {selectedPool.fpo_name}
            </h3>
            <p className="text-slate-500">
              Pooling for {selectedPool.commodity} bulk dispatch. You will receive collective bargaining premium pricing.
            </p>

            <form onSubmit={handleJoinPool} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity to Contribute (Quintals)</label>
                <input
                  type="number"
                  value={joinQty}
                  onChange={(e) => setJoinQty(Number(e.target.value))}
                  min={1}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-emerald-800"
                  required
                />
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950">
                <span>Estimated Member Payout:</span>
                <span className="text-emerald-800 font-black text-sm">
                  ₹{(joinQty * selectedPool.collective_base_price_per_q * (1 + selectedPool.estimated_buyer_premium_pct / 100)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  {isSubmitting ? "Pooling..." : "Confirm & Join Pool"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Pool Modal */}
      {isCreatePoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900">Initialize New FPO Bulk Pool</h3>
            <p className="text-slate-500">Aggregate member farmers for institutional corporate contracts.</p>

            <form onSubmit={handleCreatePool} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">FPO Organization Name</label>
                <input
                  type="text"
                  value={newPoolName}
                  onChange={(e) => setNewPoolName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Commodity</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Onion">Onion (प्याज)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Lot Size (Q)</label>
                  <input
                    type="number"
                    value={targetQty}
                    onChange={(e) => setTargetQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price (₹/Q)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  Publish Aggregation Pool
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatePoolOpen(false)}
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
