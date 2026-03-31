'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Key, Copy, Check, ShieldAlert, Cpu } from 'lucide-react';
import Cookies from 'js-cookie';

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('********************************');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      // Typically there would be a secure endpoint to regenerate or view it,
      // but if not, fallback to reading the cookie (assuming it was saved on login).
      const cookieKey = Cookies.get('apiKey');
      if (cookieKey) {
          setApiKey(cookieKey);
      } else {
          setApiKey('ERROR: NOT LOGGED IN');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 fade-in delay-400 mt-10">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_50px_rgba(245,158,11,0.5)] mb-4 relative group cursor-default">
            <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/40 transition-colors rounded-full" />
            <Key className="w-16 h-16 text-white drop-shadow-xl relative z-10" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
          Master Access Key
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Embed this cryptographic key in the <code className="bg-white/10 px-2 py-1 rounded text-amber-400 font-mono text-sm border border-white/10">X-API-KEY</code> header for all secure backend transmissions. Keep it highly confidential.
        </p>
      </div>

      <div className="premium-card rounded-[40px] p-2 overflow-hidden shadow-2xl relative group mx-auto max-w-2xl border border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-[40px] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
        
        <div className="bg-black/40 backdrop-blur-xl rounded-[36px] flex items-center justify-between p-4 border border-white/5 relative z-10">
            {loading ? (
            <div className="h-12 w-full animate-pulse bg-white/5 rounded-2xl mx-4" />
            ) : (
            <div className="px-6 py-4 flex-1">
                <span className={`font-mono text-2xl tracking-widest font-bold ${apiKey.includes('ERROR') ? 'text-red-400' : 'text-amber-400'}`}>
                    {apiKey}
                </span>
            </div>
            )}
            <button 
                onClick={handleCopy}
                disabled={loading || apiKey.includes('ERROR')}
                className="shrink-0 p-5 bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-[24px] font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group/btn hover:scale-105 active:scale-95"
            >
                {copied ? <Check className="w-7 h-7" /> : <Copy className="w-7 h-7 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
        </div>
      </div>

      <div className="premium-card bg-orange-500/5 border border-orange-500/20 p-8 rounded-[32px] flex gap-6 items-start shadow-inner max-w-2xl mx-auto">
        <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <ShieldAlert className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-orange-400 mb-2 tracking-tight">Security Protocol Violation Risk</h3>
          <p className="text-orange-200/70 leading-relaxed font-medium">
            If this key is exposed, malicious actors could permanently exhaust your rate limits and inject compromised data logs under your identity. Treat it securely.
          </p>
        </div>
      </div>
      
      {/* Decorative tech background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none -z-10 rounded-full" />
    </div>
  );
}
