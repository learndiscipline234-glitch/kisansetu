import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Smartphone,
  Send,
  PhoneCall,
  PhoneOff,
  Volume2,
  Sparkles,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const SmsIvrSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sms' | 'ivr'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('+91 98221 44520');
  const [inputMessage, setInputMessage] = useState('BHAV ONION');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'system'; text: string; time: string }>>([
    { sender: 'system', text: 'Welcome to KisanSetu SMS Gateway.\nType BHAV <CROP> for live mandi rate.\nType HOLD <CROP> for AI sale advice.', time: '09:00 AM' }
  ]);
  const [isSending, setIsSending] = useState(false);

  // IVR state
  const [isCallActive, setIsCallActive] = useState(false);
  const [ivrStep, setIvrStep] = useState(0);
  const [ivrTranscript, setIvrTranscript] = useState('Welcome to KisanSetu Toll-Free Voice Portal. Press 1 for Hindi, 2 for Marathi, 3 for English.');

  const handleSendSMS = async (textToSend: string = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = textToSend.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputMessage('');
    setIsSending(true);

    const res = await api.simulateSMS(userMsg, phoneNumber);
    setIsSending(false);

    if (res && res.sms_reply) {
      setChatHistory(prev => [...prev, { sender: 'system', text: res.sms_reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const handleIvrKeyPress = (digit: string) => {
    if (ivrStep === 0) {
      if (digit === '1') {
        setIvrTranscript('हिंदी चुनी गई। अपनी फसल का भाव जानने के लिए 1 दबाएं। AI फसल बिक्री सलाह के लिए 2 दबाएं। एस्क्रो पेमेंट स्टेटस के लिए 3 दबाएं।');
        setIvrStep(1);
      } else if (digit === '2') {
        setIvrTranscript('मराठी भाषा निवडली. बाजारभाव जाणून घेण्यासाठी १ दाबा. AI शेतमाल विक्री सल्ल्यासाठी २ दाबा.');
        setIvrStep(1);
      } else {
        setIvrTranscript('English selected. Press 1 for Mandi Prices, 2 for AI Sale Advisor, 3 for Escrow Order Status.');
        setIvrStep(1);
      }
    } else if (ivrStep === 1) {
      if (digit === '1') {
        setIvrTranscript('Lasalgaon Mandi Onion price is ₹2,350/Q. Nashik Tomato price is ₹1,650/Q. Press 9 to return to main menu.');
        setIvrStep(2);
      } else if (digit === '2') {
        setIvrTranscript('AI Advisor: For Onion, HOLD FOR 8 DAYS. Expected gain is +12.4% (to ₹2,640/Q). Press 9 for main menu.');
        setIvrStep(2);
      } else {
        setIvrTranscript('Your last order #ORD-2026-8812 is IN_TRANSIT. Payment of ₹6,12,500 is locked in secure Escrow.');
        setIvrStep(2);
      }
    } else {
      if (digit === '9') {
        setIvrTranscript('Main Menu. Press 1 for Mandi Prices, 2 for AI Sale Advice, 3 for Escrow Status.');
        setIvrStep(1);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl">
            <Smartphone className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Feature Phone & SMS / IVR Accessibility Suite</h2>
            <p className="text-xs text-emerald-100">
              Inclusive access for low-literacy farmers and 2G / non-smartphone rural regions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Interactive Phone Hardware Mockup */}
        <div className="md:col-span-1 flex justify-center">
          <div className="w-[280px] bg-slate-900 rounded-[40px] p-4 border-4 border-slate-700 shadow-2xl space-y-3">
            {/* Screen */}
            <div className="bg-emerald-950/90 text-emerald-300 rounded-2xl p-3 aspect-[4/5] border-2 border-emerald-700/50 flex flex-col justify-between overflow-hidden font-mono text-[11px]">
              <div className="flex justify-between items-center text-[10px] text-emerald-500 border-b border-emerald-800 pb-1">
                <span>KISAN-SETU 2G</span>
                <span>📶 100%</span>
              </div>

              {activeTab === 'sms' ? (
                <div className="overflow-y-auto space-y-2 py-2 flex-1 custom-scrollbar text-[10px]">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`p-1.5 rounded ${msg.sender === 'user' ? 'bg-emerald-800 text-white ml-2' : 'bg-slate-800 text-emerald-200 mr-2'}`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 space-y-3 text-center flex-1 flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 mx-auto flex items-center justify-center animate-pulse text-white">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-white font-bold">1800-KISAN-SETU</p>
                  <p className="text-[10px] text-emerald-300 italic bg-emerald-900/60 p-2 rounded border border-emerald-700">
                    "{ivrTranscript}"
                  </p>
                </div>
              )}

              <div className="text-[9px] text-center text-emerald-600 border-t border-emerald-800 pt-1">
                {activeTab === 'sms' ? 'SMS Gateway Active' : isCallActive ? 'Call Connected (00:42)' : 'Toll-Free IVR'}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-slate-200 text-xs font-bold font-mono">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleIvrKeyPress(k)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-lg transition"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Call Action */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <button
                onClick={() => { setIsCallActive(true); setActiveTab('ivr'); }}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsCallActive(false); setActiveTab('sms'); }}
                className="p-2.5 bg-rose-600 hover:bg-rose-500 rounded-full text-white shadow-md"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: SMS Simulator Console */}
        <div className="md:col-span-2 space-y-4">
          {/* Selector Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('sms')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'sms'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              SMS Command Center
            </button>
            <button
              onClick={() => setActiveTab('ivr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ivr'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              IVR Voice Call Simulator
            </button>
          </div>

          {activeTab === 'sms' ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Test Interactive SMS Queries</span>
              </h3>

              {/* Sample Chips */}
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  Click a Sample SMS Command:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "BHAV WHEAT",
                    "BHAV ONION",
                    "BHAV TOMATO",
                    "HOLD ONION",
                    "HOLD SOYBEAN",
                    "STATUS ORDER"
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => handleSendSMS(cmd)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold transition"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type custom SMS (e.g. BHAV POTATO)..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendSMS()}
                />
                <button
                  onClick={() => handleSendSMS()}
                  disabled={isSending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">How Farmers Use This on Basic Keypad Phones:</span>
                <p>• Send <strong>BHAV &lt;CROP&gt;</strong> to <strong>56161</strong> for instant live Agmarknet rate.</p>
                <p>• Send <strong>HOLD &lt;CROP&gt;</strong> to receive AI sale-window prediction & distress warning.</p>
                <p>• Send <strong>STATUS</strong> to check real-time Escrow bank disbursement.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Interactive Voice Response (IVR) Simulation</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmers dial toll-free <strong>1800-KISAN-SETU</strong> from any mobile or landline. The automated system speaks in their native regional dialect without requiring internet connectivity.
              </p>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 text-xs block">Current Audio Announcement:</span>
                <p className="text-sm font-medium text-emerald-900 italic">
                  "{ivrTranscript}"
                </p>
              </div>

              <p className="text-xs text-slate-500">
                Use the numeric keypad on the left phone mockup to simulate pressing options (1, 2, 3, 9).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
