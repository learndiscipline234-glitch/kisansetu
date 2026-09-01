import React, { useState, useEffect } from 'react';
import { Language, VoiceQueryResponse } from '../types';
import { speechService } from '../services/speech';
import { api } from '../services/api';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Clock
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<VoiceQueryResponse | null>(null);

  const samplePrompts = {
    hi: [
      "गेहूं का भाव क्या है?",
      "क्या मुझे आज टमाटर बेचना चाहिए या रुकना चाहिए?",
      "सोयाबीन का 30 दिन का भाव कैसा रहेगा?",
      "FPO पूल में कैसे शामिल हों?",
      "एस्क्रो पेमेंट कैसे काम करता है?"
    ],
    mr: [
      "कांदा बाजारभाव काय आहे?",
      "टोमॅटो आज विकू की थांबू?",
      "सोयाबीनचे पुढील ३० दिवसांचे दर कसे राहतील?",
      "शेतकरी गटामध्ये कसे सहभागी व्हावे?"
    ],
    en: [
      "What is the wheat price in Indore mandi?",
      "Should I sell my tomato produce today or hold?",
      "Show me 30-day price trend for Onion",
      "How does KisanSetu escrow payment protect farmers?"
    ],
    te: [
      "గోధుమ ధర ఎంత ఉంది?",
      "టమోటా అమ్మకానికి సరైన సమయం ఏది?"
    ],
    pa: [
      "ਕਣਕ ਦਾ ਭਾਅ ਕੀ ਹੈ?",
      "ਕੀ ਮੈਨੂੰ ਆਲੂ ਅੱਜ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?"
    ]
  };

  useEffect(() => {
    if (!isOpen) {
      speechService.stop();
      setIsListening(false);
      setTranscript('');
      setResponse(null);
    }
  }, [isOpen]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse(null);

    speechService.listen(
      language,
      (text) => {
        setTranscript(text);
        setIsListening(false);
        processQuery(text);
      },
      (err) => {
        console.warn('Speech err', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stop();
    setIsListening(false);
  };

  const processQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsProcessing(true);
    setTranscript(queryText);

    const res = await api.processVoiceQuery(queryText, language);
    setIsProcessing(false);

    if (res) {
      setResponse(res);
      // Speak out the response
      speechService.speak(res.speech_response_text, language);
    }
  };

  const handleSpeakAgain = () => {
    if (response) {
      speechService.speak(response.speech_response_text, language);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">KisanSetu Multilingual Voice AI</h3>
              <p className="text-xs text-emerald-100">
                AI Voice Assistant for Low-Literacy & Regional Dialects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Microphone Interactive Zone */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/30 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
              {isListening && (
                <span className="absolute -bottom-8 text-xs font-semibold text-rose-600 animate-pulse">
                  Listening... बोलिए
                </span>
              )}
            </button>
            <p className="text-xs text-slate-500 mt-6 text-center">
              {isListening
                ? "Listening to your voice... Speak now in your language"
                : "Tap the mic icon or select a sample question below"}
            </p>
          </div>

          {/* Transcript Display */}
          {(transcript || isProcessing) && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>You asked:</span>
              </div>
              <p className="text-sm font-medium text-slate-900 italic">
                "{transcript || 'Processing voice...'}"
              </p>
            </div>
          )}

          {/* AI Response Card */}
          {response && (
            <div className="p-4 bg-emerald-50/90 rounded-xl border border-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Advisor Answer ({response.detected_intent})</span>
                </div>
                <button
                  onClick={handleSpeakAgain}
                  className="flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-md transition font-medium"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Again</span>
                </button>
              </div>

              <p className="text-sm text-emerald-950 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-100">
                {response.speech_response_text}
              </p>

              {response.structured_data && (
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Modal Price</span>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{response.structured_data.current_price} / Q
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">AI Recommendation</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {response.structured_data.recommendation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggested Prompts */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Frequently Asked Voice Queries</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(samplePrompts[language] || samplePrompts.en).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => processQuery(prompt)}
                  className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 transition text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Powered by KisanSetu Natural Language & Agricultural Speech Engine
          </p>
        </div>
      </div>
    </div>
  );
};
