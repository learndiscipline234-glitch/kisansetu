import React from 'react';
import { Role, Language } from '../types';
import { getTranslation } from '../services/i18n';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  Users,
  ShieldCheck,
  Smartphone,
  Mic,
  FileCheck2,
  Globe2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoice: () => void;
  onOpenLedger: () => void;
  onOpenQualityScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentLanguage,
  onLanguageChange,
  onOpenVoice,
  onOpenLedger,
  onOpenQualityScanner
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);

  const roles: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'farmer', label: t('farmerPortal'), icon: <Sprout className="w-4 h-4" /> },
    { id: 'buyer', label: t('buyerPortal'), icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'fpo', label: t('fpoCollective'), icon: <Users className="w-4 h-4" /> },
    { id: 'govt', label: t('govtOversight'), icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'sms_phone', label: t('smsFeaturePhone'), icon: <Smartphone className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SIH 2026
            </span>
            <span className="font-medium opacity-90 hidden sm:inline">
              Problem Statement SIH26132 • Team Shakti • Market Linkages & Price Discovery
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenLedger}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors text-[11px]"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Immutable Ledger (SHA-256)</span>
            </button>
            <div className="h-3 w-[1px] bg-emerald-600 hidden sm:block"></div>
            <span className="text-[11px] text-emerald-200 hidden sm:inline">
              Agmarknet & e-NAM Verified Node
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onRoleChange('farmer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Kisan<span className="text-emerald-600">Setu</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-300">
                  AI v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Market Intelligence & Verified Direct Trade
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenVoice}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Role Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {roles.map(r => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* AI Quality Scanner Button */}
          <button
            onClick={onOpenQualityScanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-400 bg-white text-slate-700 hover:text-emerald-700 text-xs font-medium transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Quality Scan</span>
          </button>

          {/* Voice Assistant Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-sm hover:from-emerald-700 hover:to-teal-700 transition animate-pulse-glow"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{t('voiceAction')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe2 className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              aria-label="Select Language"
              className="pl-8 pr-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
