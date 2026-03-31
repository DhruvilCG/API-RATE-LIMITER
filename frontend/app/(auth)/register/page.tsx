'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { ShieldBan, ArrowRight, Lock, Mail, Loader2, Sparkles, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (!name.trim()) throw new Error('Name is required');
      
      const response = await api.post('/auth/register', { 
        name: name.trim(), 
        email: email.trim(), 
        password 
      });
      
      // Auto login on successful registration
      Cookies.set('apiKey', response.data.apiKey, { expires: 7 }); 
      Cookies.set('token', response.data.token || response.data.apiKey, { expires: 7 }); 
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto z-10 zoom-in-95 duration-500 animate-in">
      <div className="premium-card rounded-[40px] p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center mb-10 relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-fuchsia-400 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(217,70,239,0.4)] border border-white/20">
            <Sparkles className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
            Initialization
          </h2>
          <p className="text-gray-400 mt-3 font-medium">Create a new Sentinel Operator Profile.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-fuchsia-400" /> Operator Name
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-white font-medium"
              placeholder="Sentinel Agent 007"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> New Operator Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white font-medium"
              placeholder="admin@sentinel.dev"
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" /> Secure Passcode
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white font-medium tracking-widest"
              placeholder="••••••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Deploy Security Key <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium relative z-10">
          Existing operator?{' '}
          <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-bold underline underline-offset-4 decoration-fuchsia-400/30">
            Authenticate
          </Link>
        </p>
      </div>
    </div>
  );
}
