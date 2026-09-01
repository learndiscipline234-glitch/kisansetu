import React, { useState } from 'react';
import { PriceForecast } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface PriceTrendChartProps {
  forecast: PriceForecast | null;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ forecast }) => {
  const [activeView, setActiveView] = useState<'both' | 'history' | 'forecast'>('both');

  if (!forecast) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center min-h-[350px]">
        <div className="text-slate-400 text-xs font-semibold flex items-center space-x-2">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Generating AI Time-Series Price Trend Curve...</span>
        </div>
      </div>
    );
  }

  // Combine historical and forecasted data
  const chartData: any[] = [];

  // Add history
  forecast.historical_7d.forEach(pt => {
    chartData.push({
      date: pt.date.slice(5), // MM-DD
      historicalPrice: pt.price,
      predictedPrice: null,
      lowerBound: null,
      upperBound: null,
      type: 'History'
    });
  });

  // Connect last historical with first forecast
  const lastHist = forecast.historical_7d[forecast.historical_7d.length - 1];
  if (lastHist) {
    chartData[chartData.length - 1].predictedPrice = lastHist.price;
    chartData[chartData.length - 1].lowerBound = lastHist.price;
    chartData[chartData.length - 1].upperBound = lastHist.price;
  }

  // Add forecast points (sampled every 2-3 days for chart readability)
  forecast.forecast_30d.forEach((pt, idx) => {
    if (idx % 2 === 0 || idx === forecast.forecast_30d.length - 1) {
      chartData.push({
        date: pt.date.slice(5), // MM-DD
        historicalPrice: null,
        predictedPrice: pt.predicted_price,
        lowerBound: pt.lower_bound,
        upperBound: pt.upper_bound,
        type: 'Forecast'
      });
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
          <p className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1.5">
            Date: {label}
          </p>
          {payload.map((item: any, index: number) => {
            if (item.value === null || item.value === undefined) return null;
            return (
              <div key={index} className="flex items-center justify-between space-x-3 py-0.5">
                <span className="text-slate-400 capitalize">{item.name}:</span>
                <span className="font-bold text-emerald-400">₹{item.value.toLocaleString('en-IN')}/Q</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Price Trajectory & AI 30-Day Forecast
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ML Scikit-Learn Model
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {forecast.commodity} in {forecast.mandi_name} • Includes 95% confidence intervals
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Historical</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>AI Forecast</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-600/60 text-[11px] hidden sm:flex">
            <span className="w-2.5 h-1.5 rounded-xs bg-emerald-200"></span>
            <span>Confidence Range</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence Envelope */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="#dcfce7"
              fillOpacity={0.4}
              name="Upper Range (+95%)"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1.0}
              name="Lower Range (-95%)"
            />

            {/* Historical Curve */}
            <Line
              type="monotone"
              dataKey="historicalPrice"
              stroke="#64748b"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#64748b' }}
              name="Historical Price"
            />

            {/* Forecast Curve */}
            <Line
              type="monotone"
              dataKey="predictedPrice"
              stroke="#059669"
              strokeWidth={3}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#059669' }}
              name="Predicted Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights Alert */}
      <div className="flex items-center space-x-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Peak selling realization projected around <strong className="text-slate-900">{forecast.optimal_sale_date}</strong>. Holding beyond 30 days is subject to new harvest arrival pressure.
        </span>
      </div>
    </div>
  );
};
