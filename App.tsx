
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import VerificationLab from './components/VerificationLab';
import Dashboard from './components/Dashboard';
import HistoryLogs from './components/HistoryLogs';
import { ContentType, VerificationResult, HistoryItem } from './types';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('verify');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  // Persistence (Mocked with local state for this demo environment)
  const handleResultSave = (type: ContentType, input: string, result: VerificationResult) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      input: type === 'text' ? input.substring(0, 100) + (input.length > 100 ? '...' : '') : 'Uploaded Media',
      result
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'verify':
        return <VerificationLab onResultSave={handleResultSave} />;
      case 'dashboard':
        return <Dashboard history={history} />;
      case 'history':
        return <HistoryLogs history={history} />;
      case 'about':
        return (
          <div className="max-w-3xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Trust Methodology</h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                VeriTrust AI moves beyond binary detection. We focus on <span className="text-indigo-600 font-semibold">provenance, logical consistency, and behavioral intent.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-xl text-indigo-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Digital Signatures</h3>
                <p className="text-slate-500 leading-relaxed">
                  We look for invisible "tells" left by generation algorithms, including specific frequency anomalies in audio and pixel-level patterns in images.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center rounded-xl text-emerald-600">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Semantic Drift</h3>
                <p className="text-slate-500 leading-relaxed">
                  Human speech has intent. AI speech has patterns. We analyze structural drift and logical coherence to separate real interactions from bot-generated scripts.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-10 text-white overflow-hidden relative">
              <div className="relative z-10 space-y-6">
                <h2 className="text-2xl font-bold">A Unified Ecosystem</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  Trust is the fundamental pillar of the digital world. Our mission is to provide individuals and institutions the tools to navigate a synthetic world with confidence.
                </p>
                <button 
                  onClick={() => setActiveTab('verify')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all"
                >
                  Start Verifying Now
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
            </div>
          </div>
        );
      default:
        return <VerificationLab onResultSave={handleResultSave} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex justify-center">
              <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trust but verify.</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                Welcome to VeriTrust AI. Our suite is designed to help you distinguish between human intent and synthetic creation in an age of indistinguishable digital artifacts.
              </p>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-xl"
            >
              Enter the Lab
            </button>
            <p className="text-xs text-slate-400 font-medium">Powered by Gemini Authenticity Core</p>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
