
import React from 'react';
import { HistoryItem } from '../types';
import { FileText, Image as ImageIcon, Music, Calendar, ChevronRight, History } from 'lucide-react';

interface HistoryLogsProps {
  history: HistoryItem[];
}

const HistoryLogs: React.FC<HistoryLogsProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800">No logs found</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">Analyzed artifacts will appear here for audit and reference.</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusColor = (rating: string) => {
    switch (rating) {
      case 'Authentic': return 'bg-emerald-100 text-emerald-700';
      case 'Suspicious': return 'bg-amber-100 text-amber-700';
      case 'Synthetic': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Digital Audit Trail</h1>
          <p className="text-slate-500 mt-1">A historical log of verified content and detected intent.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Content Artifact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Result</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trust Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="max-w-[200px]">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.type === 'text' ? item.input : `Binary ${item.type} File`}
                        </p>
                        <p className="text-xs text-slate-400 capitalize">{item.type} Analysis</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.result.authenticityRating)}`}>
                      {item.result.authenticityRating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.result.trustScore > 70 ? 'bg-emerald-500' : item.result.trustScore > 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} 
                          style={{ width: `${item.result.trustScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item.result.trustScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryLogs;
