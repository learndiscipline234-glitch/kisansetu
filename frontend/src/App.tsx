import React, { useState } from 'react';
import { Role, Language } from './types';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { PriceIntelligencePage } from './pages/PriceIntelligencePage';
import { FpoDashboard } from './pages/FpoDashboard';
import { GovtAnalyticsPage } from './pages/GovtAnalyticsPage';
import { SmsIvrSimulator } from './components/SmsIvrSimulator';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { QualityGradingScanner } from './components/QualityGradingScanner';
import { LedgerAuditModal } from './components/LedgerAuditModal';
import { Sprout, PhoneCall, ShieldCheck, FileCheck2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>('farmer');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isQualityScannerOpen, setIsQualityScannerOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Universal Navigation Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenQualityScanner={() => setIsQualityScannerOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentRole === 'farmer' && (
          <FarmerDashboard
            onOpenQualityScanner={() => setIsQualityScannerOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}

        {currentRole === 'buyer' && (
          <BuyerDashboard />
        )}

        {currentRole === 'fpo' && (
          <FpoDashboard />
        )}

        {currentRole === 'govt' && (
          <GovtAnalyticsPage
            onOpenLedger={() => setIsLedgerOpen(true)}
          />
        )}

        {currentRole === 'sms_phone' && (
          <SmsIvrSimulator />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="text-white font-black text-sm tracking-tight">
              KisanSetu • Smart India Hackathon 2026
            </span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-300 font-medium">
              Problem Statement SIH26132: Strengthening Market Linkages & Price Discovery for Farmers
            </p>
            <p className="text-slate-500 text-[11px]">
              Team Shakti • Agmarknet & e-NAM Integration • AI Sale-Window Advisor • Smart Escrow Protocol
            </p>
          </div>
        </div>
      </footer>

      {/* Universal Floating Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={currentLanguage}
      />

      <QualityGradingScanner
        isOpen={isQualityScannerOpen}
        onClose={() => setIsQualityScannerOpen(false)}
      />

      <LedgerAuditModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />
    </div>
  );
};

export default App;
