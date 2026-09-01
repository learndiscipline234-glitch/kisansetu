import React, { useState, useEffect } from 'react';
import { LedgerBlock } from '../types';
import { api } from '../services/api';
import {
  FileCheck2,
  X,
  Lock,
  Link,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';

interface LedgerAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LedgerAuditModal: React.FC<LedgerAuditModalProps> = ({ isOpen, onClose }) => {
  const [blocks, setBlocks] = useState<LedgerBlock[]>([]);
  const [filterOrderId, setFilterOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLedger();
    }
  }, [isOpen]);

  const fetchLedger = async (orderId?: string) => {
    setLoading(true);
    const res = await api.getLedgerHistory(orderId);
    setBlocks(res);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center space-x-2">
                <span>Immutable Agricultural Trade Ledger</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700">
                  SHA-256 Chained
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographically verifiable audit trail for every lot, offer, escrow and delivery
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filterOrderId}
              onChange={(e) => setFilterOrderId(e.target.value)}
              placeholder="Search by Order ID or Lot ID..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchLedger(filterOrderId.trim() || undefined)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
            >
              Filter Ledger
            </button>
            <button
              onClick={() => { setFilterOrderId(''); fetchLedger(); }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Block History List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Verifying cryptographic hash chain...</div>
          ) : blocks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">No ledger blocks found for this query.</div>
          ) : (
            blocks.map((block) => (
              <div
                key={block.block_index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 transition shadow-2xs space-y-3"
              >
                {/* Block Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      BLOCK #{block.block_index}
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {block.event_type}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      By: <strong className="text-slate-900">{block.actor}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Event Summary */}
                <p className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-slate-100">
                  {block.payload_summary}
                </p>

                {/* Hashes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-slate-100 p-2 rounded border border-slate-200 overflow-hidden text-ellipsis">
                    <span className="text-slate-400 block font-sans font-bold">PREVIOUS BLOCK HASH:</span>
                    <span className="text-slate-600 break-all">{block.previous_hash}</span>
                  </div>
                  <div className="bg-emerald-950 text-emerald-300 p-2 rounded border border-emerald-800 overflow-hidden text-ellipsis">
                    <span className="text-emerald-400 block font-sans font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                      <span>CURRENT SHA-256 HASH:</span>
                    </span>
                    <span className="break-all font-bold">{block.block_hash}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            KisanSetu Immutable Audit Protocol • ISO 27001 & Indian Information Technology Act Compliant
          </p>
        </div>
      </div>
    </div>
  );
};
