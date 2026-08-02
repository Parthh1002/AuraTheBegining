'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // HARDCODED CREDENTIALS AS PER USER REQUEST
    if (email.trim() === '11a21278parth@gmail.com' && password === 'Aura@2026') {
      // Create a mock token for local session
      const mockToken = 'aura-admin-hardcoded-token-12345';
      localStorage.setItem('aura-admin-token', mockToken);
      document.cookie = `aura-admin-token=${mockToken}; path=/; max-age=604800; SameSite=Lax`;
      
      // Simulate network delay for UX
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 800);
      return;
    } else {
      setTimeout(() => {
        setErrorMsg('Invalid credentials. Access is restricted.');
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-aura-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-aura-surface border border-aura-gold/30 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,160,42,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-aura-ink">AURA</span>
          <span className="block text-[10px] tracking-[0.3em] text-aura-gold uppercase font-bold">ADMINISTRATOR CMS ACCESS</span>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/30 rounded-lg text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-aura-ink">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@auramenswear.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink pl-10 pr-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
              />
              <Mail className="w-4 h-4 text-aura-subink absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-aura-ink">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink pl-10 pr-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
              />
              <Lock className="w-4 h-4 text-aura-subink absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-aura-gold-soft transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
