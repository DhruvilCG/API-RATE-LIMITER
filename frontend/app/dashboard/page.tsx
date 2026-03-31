'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Activity, ShieldCheck, ShieldAlert, Zap, Server, Network } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    allowedRequests: 0,
    blockedRequests: 0,
    activeRules: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

    const fetchDashboardData = async () => {
    try {
      const logsResp = await api.get('/logs');
      const rulesResp = await api.get('/rate-limit');
      const statsResp = await api.get('/logs/stats');
      
      const logs = logsResp.data;
      const rules = rulesResp.data;
      const backendStats = statsResp.data;
      
      setStats({
        totalRequests: backendStats.total || 0,
        allowedRequests: backendStats.allowed || 0,
        blockedRequests: backendStats.blocked || 0,
        activeRules: rules.length
      });

      // Group logs by minute for the real-time effect
      const grouped = logs.reduce((acc: any, log: any) => {
        const d = new Date(log.timestamp);
        d.setSeconds(0, 0); // round to minute
        const key = d.getTime();
        
        if (!acc[key]) {
          acc[key] = { time: key, allowed: 0, blocked: 0 };
        }
        
        if (log.status === 429) {
          acc[key].blocked++;
        } else {
          acc[key].allowed++;
        }
        return acc;
      }, {});

      const formattedData = Object.values(grouped).sort((a: any, b: any) => a.time - b.time).map((d: any) => ({
        ...d,
        timeLabel: format(new Date(d.time), 'HH:mm')
      }));

      if (formattedData.length === 0) {
        setChartData([{ timeLabel: format(new Date(), 'HH:mm'), allowed: 0, blocked: 0 }]);
      } else {
        setChartData(formattedData);
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="premium-card p-8 rounded-3xl group cursor-default">
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-60 bg-${color}-500`} />
      <div className="flex items-start justify-between mb-8 relative z-10">
        <h3 className="text-gray-400 font-semibold tracking-wide uppercase text-sm">{title}</h3>
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-${color}-500/50 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
          <Icon className={`w-6 h-6 text-${color}-400 group-hover:drop-shadow-[0_0_10px_currentColor] transition-all`} />
        </div>
      </div>
      <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 relative z-10 tracking-tighter">
        {value.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 fade-in delay-100">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-400 tracking-tight">
            Traffic Overview
          </h1>
          <p className="text-gray-400 mt-2 text-lg">System bandwidth and rate limiter enforcement</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 backdrop-blur-md"
        >
          {loading ? <Activity className="w-5 h-5 animate-spin text-cyan-400" /> : <Server className="w-5 h-5 text-cyan-400" />}
          Refresh Metrics
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 premium-card rounded-3xl animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatCard 
            title="Total Handled" 
            value={stats.totalRequests} 
            icon={Network} 
            color="blue"
          />
          <StatCard 
            title="Successfully Permitted" 
            value={stats.allowedRequests} 
            icon={ShieldCheck} 
            color="emerald"
          />
          <StatCard 
            title="Forcefully Blocked" 
            value={stats.blockedRequests} 
            icon={ShieldAlert} 
            color="red"
          />
          <StatCard 
            title="Active Restrictions" 
            value={stats.activeRules} 
            icon={Zap} 
            color="fuchsia"
          />
        </div>
      )}

      {/* Chart Section */}
      <div className="relative mt-12 group pt-8">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-indigo-500/20 to-purple-600/20 rounded-[40px] blur-3xl opacity-30 transition duration-1000 group-hover:opacity-50"></div>
        <div className="premium-card rounded-[32px] p-10 border border-white/10 relative z-10 w-full overflow-hidden">
          
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <Activity className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              Bandwidth Topology
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                 <span className="text-sm font-semibold text-gray-300">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>
                 <span className="text-sm font-semibold text-gray-300">Blocked</span>
              </div>
            </div>
          </div>

          <div className="h-[450px] w-full relative">
            {chartData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-lg">No traffic recorded yet</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="timeLabel" 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                  tick={{ fontSize: 13, fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                  dx={-15}
                  tick={{ fontSize: 13, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 20, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                    padding: '16px'
                  }}
                  itemStyle={{ color: '#f3f4f6', fontWeight: 600, padding: '4px 0' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '8px', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="allowed" 
                  stroke="#34d399" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAllowed)" 
                  name="Allowed Traffic"
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="blocked" 
                  stroke="#f87171" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBlocked)" 
                  name="Mitigated Attacks"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
