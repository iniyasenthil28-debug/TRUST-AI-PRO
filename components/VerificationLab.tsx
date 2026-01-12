
import React, { useState, useRef } from 'react';
import { FileText, Image as ImageIcon, Music, Search, Send, Loader2, AlertCircle, CheckCircle2, ShieldAlert, BarChart3 } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { ContentType, VerificationResult } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';

interface VerificationLabProps {
  onResultSave: (type: ContentType, input: string, result: VerificationResult) => void;
}

const VerificationLab: React.FC<VerificationLabProps> = ({ onResultSave }) => {
  const [activeType, setActiveType] = useState<ContentType>('text');
  const [textInput, setTextInput] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFileData(base64.split(',')[1]); // Only base64 part
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const input = activeType === 'text' ? textInput : fileData!;
      const data = await analyzeContent(activeType, input);
      setResult(data);
      onResultSave(activeType, input, data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Authentic': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Suspicious': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Synthetic': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const chartData = result ? [{ name: 'Trust', value: result.trustScore, fill: result.trustScore > 70 ? '#10b981' : result.trustScore > 40 ? '#f59e0b' : '#ef4444' }] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Authenticity Lab</h1>
        <p className="text-slate-500 mt-2">Deep forensic analysis of digital artifacts to establish intent and confidence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {(['text', 'image', 'audio'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveType(t);
                    setResult(null);
                  }}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    activeType === t ? 'bg-white text-indigo-600 border-t-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'text' && <FileText className="w-4 h-4" />}
                  {t === 'image' && <ImageIcon className="w-4 h-4" />}
                  {t === 'audio' && <Music className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeType === 'text' ? (
                <textarea
                  placeholder="Paste digital content, reviews, news snippets, or credentials for verification..."
                  className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-700"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors bg-slate-50/30"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {activeType === 'image' ? <ImageIcon className="w-6 h-6 text-slate-400" /> : <Music className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">{fileName || `Upload ${activeType} file`}</p>
                    <p className="text-xs text-slate-400 mt-1">Supports {activeType === 'image' ? 'JPG, PNG, WEBP' : 'MP3, WAV, PCM'}</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept={activeType === 'image' ? 'image/*' : 'audio/*'} 
                    onChange={handleFileChange}
                  />
                </div>
              )}

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || (activeType === 'text' ? !textInput : !fileData)}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isAnalyzing ? 'Processing Forensics...' : 'Initialize Analysis'}
              </button>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-indigo-700 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Why intent matters</h3>
                <p className="text-indigo-200 text-sm mt-1 leading-relaxed">
                  Deep detection isn't just about "is this AI?". It's about determining if the content aims to mislead, persuade, or deceive. VeriTrust analyzes logical flow and stylistic fingerprints to uncover the hidden goal of digital communication.
                </p>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5">
          {!result && !isAnalyzing && (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white/50">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h3 className="font-semibold text-slate-900">Analysis Pending</h3>
              <p className="text-sm mt-1">Submit content to generate a trust report and authenticity profile.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
              <div>
                <h3 className="text-lg font-bold text-slate-800">Extracting Artifacts</h3>
                <p className="text-slate-500 text-sm">Cross-referencing stylistic fingerprints and metadata patterns...</p>
              </div>
              <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-2/3 animate-[progress_2s_infinite]" />
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-500">
              <div className={`p-6 border-b flex items-center justify-between ${getRatingColor(result.authenticityRating)}`}>
                <div className="flex items-center gap-3">
                  {result.authenticityRating === 'Authentic' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  <h2 className="text-xl font-bold">{result.authenticityRating}</h2>
                </div>
                <div className="text-sm font-mono font-bold tracking-widest opacity-70">
                  {result.authenticityRating.toUpperCase()}
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Confidence Meter */}
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={chartData} startAngle={180} endAngle={0}>
                        <RadialBar background dataKey="value" cornerRadius={30} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                      <span className="text-2xl font-bold text-slate-900">{result.trustScore}%</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      Executive Summary
                    </h4>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                </div>

                {/* Intent Analysis */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Intent Profiling</h4>
                  <p className="text-sm italic text-slate-700 leading-relaxed">
                    "{result.intentAnalysis}"
                  </p>
                </div>

                {/* Indicator Points */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technological Indicators</h4>
                  <div className="space-y-2">
                    {result.analysisPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 leading-tight">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationLab;
