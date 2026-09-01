import React from 'react';
import { PriceForecast } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SaleWindowCardProps {
  forecast: PriceForecast | null;
  onOpenPriceExplorer?: () => void;
}

export const SaleWindowCard: React.FC<SaleWindowCardProps> = ({
  forecast,
  onOpenPriceExplorer
}) => {
  if (!forecast) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse flex items-center justify-center min-h-[220px]">
        <div className="text-slate-400 text-xs font-semibold flex items-center space-x-2">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Loading AI Price Intelligence Engine...</span>
        </div>
      </div>
    );
  }

  const isGainPositive = forecast.expected_gain_percent > 0;
  const isHighRisk = forecast.distress_risk_score > 50;

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
      {/* Decorative top badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
              AI Sale-Window & Distress Prevention Advisor
            </h3>
            <p className="text-[11px] text-slate-500">
              {forecast.commodity} • {forecast.mandi_name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            forecast.market_sentiment.includes('Bullish')
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : forecast.market_sentiment.includes('Bearish')
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            {forecast.market_sentiment}
          </span>
        </div>
      </div>

      {/* Main Recommendation Banner */}
      <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-xs mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">
              Optimal Action Recommendation
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2 mt-0.5">
              <span>{forecast.sale_window_recommendation}</span>
              {isGainPositive ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-600 inline" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-600 inline" />
              )}
            </span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {forecast.recommendation_detail}
            </p>
          </div>

          <div className="flex items-center space-x-3 md:border-l md:pl-4 border-slate-100 shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Date</span>
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1 justify-center mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{forecast.optimal_sale_date}</span>
              </span>
            </div>

            <div className="text-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Expected Gain</span>
              <span className="text-sm font-black text-emerald-800">
                {isGainPositive ? `+${forecast.expected_gain_percent}%` : `${forecast.expected_gain_percent}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
        {/* Metric 1: Current Price */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Modal Price</span>
          <span className="text-base font-black text-slate-900 mt-0.5 block">
            ₹{forecast.current_modal_price.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500 font-normal">/ Q</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Agmarknet live sync</span>
        </div>

        {/* Metric 2: Distress Risk */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Distress Selling Risk</span>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  forecast.distress_risk_score > 60
                    ? 'bg-rose-500'
                    : forecast.distress_risk_score > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${forecast.distress_risk_score}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-800 shrink-0">
              {forecast.distress_risk_score}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {forecast.distress_risk_score < 30 ? 'Low risk (Safe to hold)' : 'Elevated risk (Monitor storage)'}
          </span>
        </div>

        {/* Metric 3: FPO Collective Power */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">FPO Pooling Advantage</span>
          <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
            +6.5% Buyer Premium
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Aggregating lots reduces distress sale
          </span>
        </div>
      </div>

      {/* Key Market Drivers */}
      <div className="space-y-1.5 text-xs text-slate-600 bg-emerald-900/5 p-3 rounded-xl border border-emerald-100">
        <span className="text-[10px] uppercase font-bold text-emerald-900 block mb-1">
          Key Underlying Market Drivers
        </span>
        {forecast.key_drivers.slice(0, 2).map((driver, i) => (
          <div key={i} className="flex items-start space-x-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{driver}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
