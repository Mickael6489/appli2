
import React, { useState } from 'react';
import { 
  ArrowLeftIcon, CpuChipIcon, BoltIcon, CheckCircleIcon, 
  ExclamationTriangleIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { askBrain } from '../services/geminiService';

interface MineBrainAppProps {
  onBack: () => void;
}

const MineBrainApp: React.FC<MineBrainAppProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await askBrain('mine-brain', query);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MineBrain <span className="text-orange-500">OS</span></h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Site Command Center</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main AI Terminal */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px]">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">General Manager AI Assistant</span>
                <BoltIcon className="w-4 h-4 text-orange-500" />
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 font-mono text-sm">
                {!response && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                    <CpuChipIcon className="w-16 h-16" />
                    <p>Awaiting Command...</p>
                  </div>
                )}
                {loading && (
                   <div className="space-y-2 animate-pulse">
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                   </div>
                )}
                {response && <div className="whitespace-pre-wrap">{response}</div>}
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask for site report, efficiency analysis, or shift scheduling..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleAsk()}
                />
                <button 
                  onClick={handleAsk}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  EXECUTE
                </button>
              </div>
           </div>
        </div>

        {/* Live Metrics (Mock) */}
        <div className="space-y-6">
           <MetricCard title="Production (YTD)" value="1.2M Tonnes" trend="+4.5%" positive />
           <MetricCard title="Safety Incidents" value="0" trend="Safe" positive />
           <MetricCard title="Fleet Availability" value="87%" trend="-2.1%" positive={false} />
           
           <div className="bg-slate-800 text-slate-300 p-4 rounded-xl text-xs font-mono space-y-2">
             <h3 className="text-white font-bold mb-2">SYSTEM STATUS</h3>
             <div className="flex justify-between"><span>BlastBrain</span><span className="text-emerald-400">ACTIVE</span></div>
             <div className="flex justify-between"><span>GeoBrain</span><span className="text-emerald-400">ACTIVE</span></div>
             <div className="flex justify-between"><span>FleetOps</span><span className="text-amber-400">WARN</span></div>
           </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string, trend: string, positive: boolean}> = ({title, value, trend, positive}) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded ${positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {trend}
      </span>
    </div>
  </div>
);

export default MineBrainApp;
