import React, { useState, useEffect } from 'react';
import { ArbitrageOpportunity, MandiRecord } from '../types';
import { api } from '../services/api';
import {
  TrendingUp,
  Truck,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MandiArbitrageMapProps {
  sourceMandiId: string;
  sourceMandiName: string;
  commodity: string;
}

export const MandiArbitrageMap: React.FC<MandiArbitrageMapProps> = ({
  sourceMandiId,
  sourceMandiName,
  commodity
}) => {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArbitrage = async () => {
      setLoading(true);
      const res = await api.getArbitrage(sourceMandiId, commodity);
      setOpportunities(res);
      setLoading(false);
    };
    fetchArbitrage();
  }, [sourceMandiId, commodity]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Mandi Price Arbitrage & Net Freight Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Comparing <strong>{sourceMandiName}</strong> with nearby regional trading yards for <strong>{commodity}</strong>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-semibold block">Freight Baseline</span>
          <span className="text-xs font-bold text-slate-800">₹1.40 / km / Quintal</span>
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Calculating multi-mandi freight routes & price spreads...</span>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
          No alternative mandis found within 400km trading radius for this commodity.
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp, idx) => {
            const isProfitable = opp.net_profit_per_quintal > 0;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  opp.net_profit_per_quintal > 50
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : isProfitable
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Mandi Path */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{opp.target_mandi}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                        {opp.distance_km} km away
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      {opp.recommendation}
                    </p>
                  </div>

                  {/* Economics Breakdown */}
                  <div className="flex items-center space-x-4 shrink-0 sm:border-l sm:pl-4 border-slate-200">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Target Price</span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{opp.target_price.toLocaleString('en-IN')}/Q
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Freight: -₹{opp.est_freight_cost}/Q
                      </span>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Net Realization</span>
                      <span className={`text-sm font-black ${
                        opp.net_profit_per_quintal > 50
                          ? 'text-emerald-700'
                          : isProfitable
                          ? 'text-amber-700'
                          : 'text-rose-600'
                      }`}>
                        {opp.net_profit_per_quintal > 0 ? `+₹${opp.net_profit_per_quintal}` : `-₹${Math.abs(opp.net_profit_per_quintal)}`}
                        <span className="text-[10px] font-normal"> /Q</span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 block">
                        {opp.net_profit_per_quintal > 50 ? 'Recommended' : isProfitable ? 'Moderate' : 'Unfavorable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
