import React, { useState } from 'react';
import { EscrowOrder } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Sparkles,
  QrCode,
  KeyRound,
  FileCheck2,
  Award
} from 'lucide-react';

interface EscrowTimelineProps {
  order: EscrowOrder;
  onOrderUpdated?: (order: EscrowOrder) => void;
  userRole?: 'farmer' | 'buyer';
}

export const EscrowTimeline: React.FC<EscrowTimelineProps> = ({
  order,
  onOrderUpdated,
  userRole = 'farmer'
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [showOtpBox, setShowOtpBox] = useState(false);

  const steps = [
    { id: 'PENDING_DEPOSIT', label: 'Offer Accepted', desc: 'Smart Contract Generated' },
    { id: 'DEPOSITED', label: 'Escrow Vault Funded', desc: '100% Amount Locked in SBI Vault' },
    { id: 'IN_TRANSIT', label: 'Produce Dispatched', desc: `${order.transporter_name} (${order.tracking_number})` },
    { id: 'INSPECTION_VERIFIED', label: 'Gate Inspection OK', desc: 'Quality Grade & Weight Verified' },
    { id: 'RELEASED', label: 'Funds Released to Farmer', desc: 'Instant UPI/IMPS Settlement' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING_DEPOSIT': return 0;
      case 'DEPOSITED': return 1;
      case 'IN_TRANSIT': return 2;
      case 'INSPECTION_VERIFIED': return 3;
      case 'RELEASED': return 4;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.escrow_status);

  const handleAdvanceState = async (nextStatus: string, actor: string) => {
    setIsUpdating(true);
    const res = await api.updateOrderStatus(order.order_id, nextStatus, actor);
    setIsUpdating(false);

    if (res && res.order) {
      if (nextStatus === 'RELEASED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      if (onOrderUpdated) onOrderUpdated(res.order);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-base">
                Order #{order.order_id}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {order.escrow_status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {order.quantity_quintals}Q {order.commodity} • {order.farmer_name} ➔ {order.buyer_name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Escrow Value</span>
          <span className="text-lg font-black text-emerald-700">
            ₹{order.total_amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Interactive Step-by-Step Progress */}
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 z-0" />
        <div
          className="hidden sm:block absolute top-1/2 left-4 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentStepIdx / (steps.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-2 ring-emerald-400/20'
                    : isCompleted
                    ? 'bg-white border-emerald-200'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center mb-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight mb-0.5">
                  {step.label}
                </h4>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logistics & OTP Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Logistics Information */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-800 mb-1">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Transport & Route Tracking</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold">Origin Mandi:</span>
              <span className="font-bold text-slate-800">{order.origin_mandi}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Destination:</span>
              <span className="font-bold text-slate-800">{order.destination_city}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Transporter:</span>
              <span className="font-bold text-slate-800">{order.transporter_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Waybill Number:</span>
              <span className="font-mono font-bold text-emerald-700">{order.tracking_number}</span>
            </div>
          </div>
        </div>

        {/* Action / Escrow Release Verification */}
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>Delivery OTP Verification</span>
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
                OTP: {order.delivery_otp}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Farmer shares OTP with buyer warehouse gate inspector upon unloading produce.
            </p>
          </div>

          {/* Action trigger button */}
          <div className="flex items-center space-x-2 pt-1">
            {order.escrow_status === 'DEPOSITED' && (
              <button
                onClick={() => handleAdvanceState('IN_TRANSIT', 'AgriLogistics Carrier')}
                disabled={isUpdating}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
              >
                Dispatch Truck & Start GPS Tracking
              </button>
            )}

            {order.escrow_status === 'IN_TRANSIT' && (
              <button
                onClick={() => handleAdvanceState('INSPECTION_VERIFIED', 'Buyer Gate Inspector')}
                disabled={isUpdating}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
              >
                Verify Gate Arrival & Produce Quality
              </button>
            )}

            {order.escrow_status === 'INSPECTION_VERIFIED' && (
              <button
                onClick={() => handleAdvanceState('RELEASED', 'KisanSetu Escrow Smart Engine')}
                disabled={isUpdating}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Release ₹{order.total_amount.toLocaleString('en-IN')} to Farmer UPI</span>
              </button>
            )}

            {order.escrow_status === 'RELEASED' && (
              <div className="w-full py-2 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Payment Disbursed Successfully to Farmer Bank Account</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
