import React, { useState } from 'react';
import { ProduceLot, QualityGrade } from '../types';
import { api } from '../services/api';
import { QualityGradingScanner } from './QualityGradingScanner';
import {
  X,
  Sprout,
  Sparkles,
  Camera,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLotCreated: (lot: ProduceLot) => void;
}

export const CreateLotModal: React.FC<CreateLotModalProps> = ({
  isOpen,
  onClose,
  onLotCreated
}) => {
  const [commodity, setCommodity] = useState('Wheat');
  const [variety, setVariety] = useState('Sharbati HD-2967');
  const [quantity, setQuantity] = useState<number>(50);
  const [basePrice, setBasePrice] = useState<number>(2550);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [isFpoPooled, setIsFpoPooled] = useState(false);
  const [farmerName, setFarmerName] = useState('Rameshwar Patil');
  const [farmerPhone, setFarmerPhone] = useState('+91 98221 44520');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [mandiNearby, setMandiNearby] = useState('Lasalgaon APMC');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [certHash, setCertHash] = useState('CERT-QS-89A4B10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lotPayload: Partial<ProduceLot> = {
      farmer_name: farmerName,
      farmer_phone: farmerPhone,
      state: state,
      district: district,
      mandi_nearby: mandiNearby,
      commodity: commodity,
      variety: variety,
      quantity_quintals: Number(quantity),
      base_price_per_q: Number(basePrice),
      quality_grade: qualityGrade,
      quality_metrics: {
        uniformity_score: qualityGrade === 'Grade A' ? 94.5 : 82.0,
        defect_percentage: qualityGrade === 'Grade A' ? 2.0 : 6.5,
        estimated_moisture_pct: 10.8,
        color_vibrancy_score: 90.0
      },
      certificate_hash: certHash,
      images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"],
      is_fpo_pooled: isFpoPooled
    };

    const res = await api.createLot(lotPayload);
    setIsSubmitting(false);

    if (res) {
      onLotCreated(res);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-bold text-base">List Produce on Verified Network</h3>
                <p className="text-xs text-emerald-100">Create digital lot with AI quality certification</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* Commodity & Variety */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Commodity (फसल)</label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Onion">Onion (प्याज)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Paddy (Basmati)">Paddy Basmati (चावल)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Variety / Strain</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Sharbati / Hybrid"
                  required
                />
              </div>
            </div>

            {/* Quantity & Base Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity (in Quintals)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Base Asking Price (₹/Q)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  min={100}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* AI Quality Grading Banner */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Quality Grade: {qualityGrade}</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Cert Hash: <span className="font-mono">{certHash}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Produce</span>
              </button>
            </div>

            {/* Farmer Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Farmer / Contact Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone (UPI linked)</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  required
                />
              </div>
            </div>

            {/* Location & Mandi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">District & State</label>
                <input
                  type="text"
                  value={`${district}, ${state}`}
                  onChange={(e) => setDistrict(e.target.value.split(',')[0] || district)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nearest Mandi Hub</label>
                <input
                  type="text"
                  value={mandiNearby}
                  onChange={(e) => setMandiNearby(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
            </div>

            {/* FPO Pooling Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer" onClick={() => setIsFpoPooled(!isFpoPooled)}>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Pool with Local FPO</span>
                  <span className="text-[10px] text-slate-500">Aggregate for 500Q bulk lot to get institutional buyer premium (+7%)</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFpoPooled}
                onChange={(e) => setIsFpoPooled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? "Creating Digital Lot..." : "Publish Lot to Verified Buyers"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quality Scanner Modal */}
      <QualityGradingScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onGradingComplete={(res) => {
          setQualityGrade(res.grade);
          setCertHash(res.certificate_hash);
          setIsScannerOpen(false);
        }}
      />
    </>
  );
};
