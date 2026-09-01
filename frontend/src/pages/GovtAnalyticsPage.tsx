import React, { useState, useEffect } from 'react';
import { LedgerBlock } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Activity,
  Building2,
  Lock,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

interface GovtAnalyticsPageProps {
  onOpenLedger: () => void;
}

export const GovtAnalyticsPage: React.FC<GovtAnalyticsPageProps> = ({ onOpenLedger }) => {
  const [blocks, setBlocks] = useState<LedgerBlock[]>([]);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [b, k] = await Promise.all([
      api.getLedgerHistory(),
      api.getMarketKPIs()
    ]);
    setBlocks(b);
    setKpis(k);
  };

  const distressAlerts = [
    {
      mandi: "Jalandhar Main Mandi (Punjab)",
      commodity: "Potato",
      price_drop_24h: -4.2,
      arrival_surge: "+38% supply influx",
      risk_level: "HIGH DISTRESS RISK",
      recommendation: "Issue sale-window advisory to hold in cold storage or divert 40% to Agra processing cluster."
    },
    {
      mandi: "Nashik APMC (Maharashtra)",
      commodity: "Tomato",
      price_drop_24h: -2.1,
      arrival_surge: "+18% local harvest",
      risk_level: "MODERATE DISTRESS RISK",
      recommendation: "Activate FPO bulk aggregation for direct Pune/Mumbai supermarket supply chain."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Govt Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                APMC & Ministry of Agriculture Oversight
              </span>
              <span className="text-xs text-emerald-300">National Policy & Market Stability Node</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Agricultural Market Oversight & Price Stability Monitor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time monitoring of inter-state trade volumes, price volatility indices, early distress selling risk signals, and tamper-proof cryptographic audit ledgers.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenLedger}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Inspect Full SHA-256 Ledger</span>
            </button>
          </div>
        </div>

        {/* National Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700 text-xs">
          <div className="bg-black/30 p-3 rounded-xl">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Market Stability Index</span>
            <span className="text-base font-black text-emerald-400">88.4 / 100 (Optimal)</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Escrow Settlement Volume</span>
            <span className="text-base font-black text-white">₹42.8 Crore (Month-to-Date)</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Average Farmer Gain</span>
            <span className="text-base font-black text-emerald-400">+11.2% over APMC base</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Dispute Settlement SLA</span>
            <span className="text-base font-black text-amber-300">&lt; 4.2 Hours</span>
          </div>
        </div>
      </div>

      {/* Real-time Distress Selling Warning System */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-black text-slate-900">
                AI Early-Warning Distress Selling Alerts
              </h2>
              <p className="text-xs text-slate-500">
                Automated detection of localized supply gluts, sharp price drops, and logistics bottlenecks
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            2 Active High-Priority Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {distressAlerts.map((alert, i) => (
            <div key={i} className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{alert.commodity}</span>
                  <span className="text-[11px] text-slate-600 block">{alert.mandi}</span>
                </div>
                <span className="font-bold text-[10px] px-2 py-0.5 bg-rose-600 text-white rounded">
                  {alert.risk_level}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-rose-100 font-semibold">
                <span>Price Trend: <strong className="text-rose-600">{alert.price_drop_24h}% (24h)</strong></span>
                <span>•</span>
                <span>Inflow: <strong>{alert.arrival_surge}</strong></span>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-100">
                <strong className="text-slate-900">Policy Recommendation:</strong> {alert.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Transaction Ledger Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Live Cryptographic Transaction Trail (SHA-256)</span>
            </h2>
            <p className="text-xs text-slate-500">Every lot listing, bid, escrow lock and delivery payout is permanently sealed</p>
          </div>
          <button
            onClick={onOpenLedger}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            View All Blocks ➔
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {blocks.slice(0, 4).map((b) => (
            <div key={b.block_index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                  #{b.block_index}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {b.event_type}
                </span>
                <span className="text-slate-700 font-medium">{b.payload_summary}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Hash: {b.block_hash.slice(0, 16)}...
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
