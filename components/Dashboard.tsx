
import React from 'react';
import { HistoryItem } from '../types';
import { ShieldCheck, ShieldAlert, BarChart, TrendingUp, Fingerprint, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const authenticCount = history.filter(h => h.result.authenticityRating === 'Authentic').length;
  const suspiciousCount = history.filter(h => h.result.authenticityRating === 'Suspicious').length;
  const syntheticCount = history.filter(h => h.result.authenticityRating === 'Synthetic').length;

  const stats = [
    { label: 'Total Verified', value: history.length, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Synthetic Content', value: syntheticCount, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Confidence Avg', value: history.length ? Math.round(history.reduce((a, b) => a + b.result.trustScore, 0) / history.length) + '%' : '0%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Suspicious Rate', value: history.length ? Math.round((suspiciousCount / history.length) * 100) + '%' : '0%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const pieData = [
    { name: 'Authentic', value: authenticCount, color: '#10b981' },
    { name: 'Suspicious', value: suspiciousCount, color: '#f59e0b' },
    { name: 'Synthetic', value: syntheticCount, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Simulated trend data
  const trendData = history.slice(-10).map((h, i) => ({
    name: i,
    score: h.result.trustScore,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Threat Landscape</h1>
        <p className="text-slate-500 mt-2">Real-time statistics of verified digital artifacts and synthesis patterns.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-indigo-600" />
              Trust Score Trends
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Last 10 Artifacts</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-indigo-600" />
            Verification Distribution
          </h3>
          <div className="h-64 flex flex-col items-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Insufficient data
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
