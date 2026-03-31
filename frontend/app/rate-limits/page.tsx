'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ShieldBan, Plus, Trash2, Edit2, AlertCircle, Clock, Zap, Check, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function RateLimitsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({ limitCount: 100, timeWindow: 60 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const resp = await api.get('/rate-limit');
      setRules(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    api.delete(`/rate-limit/${id}`)
      .then(() => {
        setTimeout(() => {
          fetchRules();
          setDeletingId(null);
        }, 400); // Wait for the zoom-out blur animation to finish
      })
      .catch(err => {
        console.error(err);
        setDeletingId(null);
      });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (newRule.limitCount <= 0 || newRule.timeWindow <= 0) {
        throw new Error('Limits must be greater than 0');
      }
      await api.post('/rate-limit', newRule);
      
      setSaveSuccess(true);
      setTimeout(() => {
          setShowModal(false);
          setSaveSuccess(false);
          setNewRule({ limitCount: 100, timeWindow: 60 });
          fetchRules();
      }, 1000); // Give the success animation time to play
    } catch (err: any) {
      setError(err.message || 'Failed to save rule');
    } finally {
      if (!saveSuccess) setSaving(false); // Only stop loading spinner if it failed (if success, we show success badge)
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 fade-in delay-200">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 tracking-tight flex items-center gap-4">
            <ShieldBan className="text-purple-400 w-10 h-10 drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]" />
            Active Restrictions
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Define strict API rate limits to secure your infrastructure.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="group px-6 py-3 bg-white/5 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-purple-300"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Deploy New Rule
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => <div key={i} className="h-48 premium-card rounded-[32px] animate-pulse" />)}
        </div>
      ) : rules.length === 0 ? (
        <div className="premium-card rounded-[32px] p-16 text-center border border-white/5 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
                <ShieldBan className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">No Active Rules</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-lg mb-8">Your API is currently completely unprotected. Deploy a rule to prevent abuse.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
                <Plus className="w-5 h-5" /> Enforce Protection
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rules.map(rule => (
            <div 
               key={rule.id} 
               className={`premium-card p-8 rounded-[32px] group relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                  deletingId === rule.id ? 'scale-50 opacity-0 blur-xl translate-y-12 rotate-3' : 'animate-spring-in'
               }`}
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-pink-600/30 transition-colors duration-700 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Zap className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Restriction Protocol #{rule.id}</h3>
                    <p className="text-sm font-medium text-purple-400 uppercase tracking-widest mt-1">Active</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(rule.id)}
                  disabled={deletingId === rule.id}
                  className="p-3 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50 hover:rotate-12 hover:scale-110 active:scale-90"
                  title="Remove Rule"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-400 mb-2 uppercase text-xs font-bold tracking-wider">
                    <Activity className="w-4 h-4" /> Allowed Volume
                  </div>
                  <div className="text-3xl font-black text-white">{rule.limitCount} <span className="text-base font-medium text-gray-500">req</span></div>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-400 mb-2 uppercase text-xs font-bold tracking-wider">
                    <Clock className="w-4 h-4" /> Window Span
                  </div>
                  <div className="text-3xl font-black text-white">{rule.timeWindow} <span className="text-base font-medium text-gray-500">sec</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Futuristic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-md premium-card rounded-[32px] p-8 overflow-hidden animate-spring-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl font-black text-white mb-2 relative z-10 flex items-center gap-3">
               <ShieldBan className="text-cyan-400 w-6 h-6" /> Deploy Rule
            </h2>
            <p className="text-gray-400 mb-8 relative z-10">Configure the exact traffic thresholds.</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3 relative z-10 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Max Requests
                </label>
                <div className="relative">
                    <input 
                    type="number" 
                    value={newRule.limitCount}
                    onChange={(e) => setNewRule({...newRule, limitCount: parseInt(e.target.value) || 0})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white font-mono text-xl"
                    placeholder="e.g. 100"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> Time Window (Seconds)
                </label>
                <div className="relative">
                    <input 
                    type="number" 
                    value={newRule.timeWindow}
                    onChange={(e) => setNewRule({...newRule, timeWindow: parseInt(e.target.value) || 0})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white font-mono text-xl"
                    placeholder="e.g. 60"
                    />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-300 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving || saveSuccess}
                  className={`flex-1 py-4 text-white rounded-2xl font-bold transition-all disabled:opacity-80 disabled:cursor-not-allowed flex justify-center items-center gap-2 relative overflow-hidden group ${
                    saveSuccess 
                      ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-spring-in scale-105 before:absolute before:inset-0 before:bg-white/20 before:animate-pulse' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {saving && !saveSuccess ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                   saveSuccess ? <><Check className="w-6 h-6 animate-spring-in"/> Deployed!</> :
                   <><Check className="w-5 h-5"/> Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
