import React, { useState } from 'react';
import { QualityGradingResult, QualityGrade } from '../types';
import { api } from '../services/api';
import {
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  X,
  Droplets,
  Scan,
  ShieldCheck,
  Award
} from 'lucide-react';

interface QualityGradingScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onGradingComplete?: (result: QualityGradingResult) => void;
}

export const QualityGradingScanner: React.FC<QualityGradingScannerProps> = ({
  isOpen,
  onClose,
  onGradingComplete
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [sampleTier, setSampleTier] = useState<'A' | 'B' | 'C'>('A');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<QualityGradingResult | null>(null);

  const sampleImages: Record<string, Record<'A' | 'B' | 'C', string>> = {
    Tomato: {
      A: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
      B: "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=600&q=80",
      C: "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80"
    },
    Wheat: {
      A: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
      B: "https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?auto=format&fit=crop&w=600&q=80",
      C: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
    },
    Onion: {
      A: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
      B: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
      C: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
    }
  };

  const currentCropImages = sampleImages[selectedCrop] || sampleImages.Tomato;

  const handleRunScan = async (tier: 'A' | 'B' | 'C' = sampleTier) => {
    setIsScanning(true);
    setResult(null);

    // Simulate scanning processing time for UX
    setTimeout(async () => {
      const res = await api.gradeProducePreset(selectedCrop, tier);
      setIsScanning(false);
      if (res) {
        setResult(res);
        if (onGradingComplete) onGradingComplete(res);
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Scan className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Computer Vision Quality Grading</h3>
              <p className="text-xs text-emerald-100">
                Objective on-farm produce assessment & digital lot certification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Commodity</label>
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setResult(null);
                }}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Onion">Onion (प्याज)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Interactive Sample Tiers</label>
              <div className="flex items-center space-x-1.5">
                {(['A', 'B', 'C'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      setSampleTier(tier);
                      handleRunScan(tier);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      sampleTier === tier
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Sample {tier} ({tier === 'A' ? 'Premium' : tier === 'B' ? 'Standard' : 'Commercial'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scanner Visual Box */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-slate-900 aspect-video max-h-64 flex items-center justify-center shadow-inner group">
            <img
              src={currentCropImages[sampleTier]}
              alt="Produce Scan"
              className="w-full h-full object-cover opacity-90 transition group-hover:scale-105 duration-500"
            />

            {/* Scanning Line Animation */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/60 backdrop-blur-xs">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#4ade80] animate-bounce" />
                <div className="mt-4 flex items-center space-x-2 bg-slate-900/90 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/40 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Extracting Color Saturation, Defect Ratio & Moisture Index...</span>
                </div>
              </div>
            )}

            {/* Scan Overlay Markers when not scanning */}
            {!isScanning && (
              <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-slate-900/80 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/30">
                    CV_FEED: ACTIVE [640x480 @ 60fps]
                  </div>
                  <div className="bg-slate-900/80 text-amber-300 text-[10px] font-mono px-2 py-1 rounded border border-amber-500/30">
                    AGMARKNET_SPECTRAL_PROFILE
                  </div>
                </div>

                {/* Bounding boxes */}
                <div className="self-center border-2 border-emerald-400/80 rounded-lg p-8 bg-emerald-500/10 backdrop-blur-xs flex flex-col items-center justify-center">
                  <Scan className="w-8 h-8 text-emerald-300 opacity-80" />
                  <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
                    Target Produce Region Detected
                  </span>
                </div>

                <div className="text-center">
                  <span className="bg-slate-900/85 text-slate-200 text-[10px] font-medium px-3 py-1 rounded-full">
                    Target Crop: {selectedCrop} • AI Model: YOLO-Agri-v9 + MobileNetV3
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Trigger Scan Button */}
          <div className="text-center">
            <button
              onClick={() => handleRunScan(sampleTier)}
              disabled={isScanning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {isScanning ? "Processing AI Analysis..." : "Execute AI Quality Inspection"}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 animate-fadeIn">
              {/* Grade Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ${
                    result.grade === 'Grade A'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                      : result.grade === 'Grade B'
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                      : 'bg-gradient-to-br from-rose-500 to-rose-700'
                  }`}>
                    {result.grade.replace('Grade ', '')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-base">{result.grade} Certified</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {result.confidence_score}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{result.grade_description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Recommended Price</span>
                  <span className="text-lg font-black text-emerald-700">₹{result.recommended_min_price} / Q</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {result.price_premium_pct >= 0 ? `+${result.price_premium_pct}% Premium` : `${result.price_premium_pct}% Discount`}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Uniformity</span>
                  <span className="text-sm font-extrabold text-slate-900">{result.uniformity_score}%</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Defect Ratio</span>
                  <span className="text-sm font-extrabold text-rose-600">{result.defect_percentage}%</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Moisture Est.</span>
                  <span className="text-sm font-extrabold text-blue-600">{result.estimated_moisture_pct}%</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Color Score</span>
                  <span className="text-sm font-extrabold text-emerald-600">{result.color_vibrancy_score}%</span>
                </div>
              </div>

              {/* Digital Certificate Hash */}
              <div className="bg-emerald-900 text-white p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <div>
                    <span className="text-[10px] text-emerald-300 font-mono block">DIGITAL LOT CERTIFICATE HASH</span>
                    <span className="text-xs font-mono font-bold text-white tracking-wider">{result.certificate_hash}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-200 font-medium hidden sm:inline">
                  Tamper-proof SHA-256
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Complies with Agmarknet & BIS (Bureau of Indian Standards) grading protocols
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
