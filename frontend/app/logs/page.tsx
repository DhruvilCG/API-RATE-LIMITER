'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Activity, ShieldCheck, ShieldAlert, RefreshCw, Terminal } from 'lucide-react';
import { format } from 'date-fns';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const resp = await api.get('/logs');
      setLogs(resp.data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 fade-in delay-300">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight flex items-center gap-4">
             <Terminal className="text-emerald-400 w-10 h-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
             Live Traffic Logs
           </h1>
           <p className="text-gray-400 mt-3 text-lg">Real-time inspection of API invocations and security blocks.</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="group px-6 py-3 bg-white/5 hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-emerald-300"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          Sync Stream
        </button>
      </div>

      <div className="premium-card rounded-[32px] border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="overflow-x-auto relative z-10 w-full">
          {loading && logs.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-gray-500 font-medium">
              <Activity className="w-12 h-12 mb-4 animate-spin text-emerald-500/50" />
              Intercepting traffic stream...
            </div>
          ) : logs.length === 0 ? (
             <div className="p-20 text-center flex flex-col items-center justify-center">
                 <Terminal className="w-16 h-16 text-white/10 mb-6" />
                 <h3 className="text-xl font-bold text-gray-300">No logs intercepted yet</h3>
                 <p className="text-gray-500 mt-2">Send requests to your backend to populate this table.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Access Time (Local)</th>
                  <th className="p-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Method</th>
                  <th className="p-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Endpoint URI</th>
                  <th className="p-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                    <td className="p-6 whitespace-nowrap text-gray-300 font-mono text-sm">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy • HH:mm:ss.SSS')}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-widest ${
                        log.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        log.method === 'POST' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        log.method === 'DELETE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="p-6 text-gray-300 font-mono text-sm">
                        <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 w-fit">
                            {log.endpoint}
                        </div>
                    </td>
                    <td className="p-6">
                      {log.status === 429 ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          <ShieldAlert className="w-4 h-4" /> Blocked (429)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-sm">
                          <ShieldCheck className="w-4 h-4" /> Allowed ({log.status})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
