import React, { useState, useEffect } from 'react';
import { MandiRecord, PriceForecast } from '../types';
import { api } from '../services/api';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { SaleWindowCard } from '../components/SaleWindowCard';
import { MandiArbitrageMap } from '../components/MandiArbitrageMap';
import {
  TrendingUp,
  Search,
  MapPin,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  Building2,
  SlidersHorizontal
} from 'lucide-react';

export const PriceIntelligencePage: React.FC = () => {
  const [mandis, setMandis] = useState<MandiRecord[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedState, setSelectedState] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMandi, setSelectedMandi] = useState<MandiRecord | null>(null);
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCrop, selectedState]);

  const loadData = async () => {
    setLoading(true);
    const [allMandis, marketKpis] = await Promise.all([
      api.getPrices(selectedCrop, selectedState),
      api.getMarketKPIs()
    ]);
    setMandis(allMandis);
    setKpis(marketKpis);

    const firstMandi = allMandis.length > 0 ? allMandis[0] : null;
    setSelectedMandi(firstMandi);

    if (firstMandi) {
      const fc = await api.getForecast(selectedCrop, firstMandi.mandi_id);
      setForecast(fc);
    }
    setLoading(false);
  };

  const handleSelectMandi = async (m: MandiRecord) => {
    setSelectedMandi(m);
    setSelectedCrop(m.commodity);
    const fc = await api.getForecast(m.commodity, m.mandi_id);
    setForecast(fc);
  };

  const filteredMandis = mandis.filter(m => {
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        m.mandi_name.toLowerCase().includes(s) ||
        m.district.toLowerCase().includes(s) ||
        m.state.toLowerCase().includes(s) ||
        m.variety.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>National Agricultural Price Intelligence & Forecasting Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Agmarknet & e-NAM Unified Price Explorer
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
              Real-time daily modal prices, daily arrivals, 30-day AI trend forecasting, and inter-mandi freight arbitrage.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-white/10 p-3 rounded-2xl border border-white/20">
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin" />
            <div>
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Data Feed Status</span>
              <span className="font-bold">Live Synced (50+ Mandis)</span>
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-700/50 text-xs">
            <div className="bg-black/20 p-3 rounded-xl">
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">Active APMC Mandis</span>
              <span className="text-base font-black">{kpis.total_active_mandis} Centers</span>
            </div>
            <div className="bg-black/20 p-3 rounded-xl">
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">Tracked Crops</span>
              <span className="text-base font-black">{kpis.tracked_commodities_count} Commodities</span>
            </div>
            <div className="bg-black/20 p-3 rounded-xl">
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">Daily Inflow</span>
              <span className="text-base font-black">{kpis.total_daily_arrival_tonnes.toLocaleString()} Tonnes</span>
            </div>
            <div className="bg-black/20 p-3 rounded-xl">
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">Data Source</span>
              <span className="text-xs font-bold text-amber-300">DMI, Govt of India</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mandi, district or state..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Commodity */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold cursor-pointer"
          >
            <option value="Wheat">Wheat (गेहूं)</option>
            <option value="Onion">Onion (प्याज)</option>
            <option value="Tomato">Tomato (टमाटर)</option>
            <option value="Soybean">Soybean (सोयाबीन)</option>
            <option value="Cotton">Cotton (कपास)</option>
            <option value="Mustard">Mustard (सरसों)</option>
            <option value="Potato">Potato (आलू)</option>
            <option value="Paddy (Basmati)">Paddy Basmati</option>
            <option value="Chana">Chana (चना)</option>
            <option value="Turmeric">Turmeric (हल्दी)</option>
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium cursor-pointer"
          >
            <option value="all">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Punjab">Punjab</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>

        <span className="text-slate-500 font-semibold">
          Showing {filteredMandis.length} Mandi Trading Yards
        </span>
      </div>

      {/* Selected Mandi Deep Dive AI Forecast */}
      {selectedMandi && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <SaleWindowCard forecast={forecast} />
            </div>
            <div className="lg:col-span-7">
              <PriceTrendChart forecast={forecast} />
            </div>
          </div>

          <MandiArbitrageMap
            sourceMandiId={selectedMandi.mandi_id}
            sourceMandiName={selectedMandi.mandi_name}
            commodity={selectedMandi.commodity}
          />
        </div>
      )}

      {/* Mandi Price Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center text-xs">
          <h3 className="font-extrabold text-slate-900">
            National Mandi Price Records for {selectedCrop}
          </h3>
          <span className="text-slate-500 text-[11px]">Click row to analyze 30-day forecast</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mandi & District</th>
                <th className="py-3 px-4">Commodity / Variety</th>
                <th className="py-3 px-4 text-right">Daily Arrivals</th>
                <th className="py-3 px-4 text-right">Min - Max Price</th>
                <th className="py-3 px-4 text-right">Modal Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMandis.map((m) => {
                const isSelected = selectedMandi?.mandi_id === m.mandi_id;
                const isUp = m.price_change_24h >= 0;

                return (
                  <tr
                    key={m.mandi_id}
                    onClick={() => handleSelectMandi(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{m.mandi_name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{m.district}, {m.state}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{m.commodity}</span>
                      <span className="text-[11px] text-slate-500 block">({m.variety})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {m.arrival_tonnes.toLocaleString()} Tonnes
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      ₹{m.min_price} - ₹{m.max_price}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                      ₹{m.modal_price.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/Q</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center space-x-1 font-bold text-[11px] px-2 py-0.5 rounded ${
                        isUp ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                      }`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isUp ? `+${m.price_change_24h}%` : `${m.price_change_24h}%`}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelectMandi(m); }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition"
                      >
                        Forecast
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
