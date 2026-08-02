'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import AuraWordmark from '@/components/ui/AuraWordmark';
import AuraParticles from '@/components/animation/AuraParticles';
import gsap from 'gsap';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power4.out', delay: 0.2 }
      );
    }
    
    // Continuous subtle pulse on the logo side
    if (logoContainerRef.current) {
      gsap.to(logoContainerRef.current, {
        backgroundPosition: '200% center',
        duration: 15,
        repeat: -1,
        ease: 'linear'
      });
    }

    // Floating animation for the left panel logo elements
    if (leftPanelRef.current) {
      gsap.to(leftPanelRef.current, {
        y: -10,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // HARDCODED CREDENTIALS AS PER USER REQUEST
    if (email.trim() === 'aura2026@gmail.com' && password === 'Aura@2026') {
      const mockToken = 'aura-admin-hardcoded-token-12345';
      localStorage.setItem('aura-admin-token', mockToken);
      document.cookie = `aura-admin-token=${mockToken}; path=/; max-age=604800; SameSite=Lax`;
      
      // Success animation before redirect
      if (modalRef.current) {
        gsap.to(modalRef.current, {
          scale: 0.95,
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            router.push('/admin/dashboard');
            router.refresh();
          }
        });
      }
    } else {
      setTimeout(() => {
        setErrorMsg('Invalid credentials. Access is restricted.');
        setLoading(false);
        // Error shake animation
        if (modalRef.current) {
          gsap.fromTo(modalRef.current, 
            { x: -10 }, 
            { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set(modalRef.current, { x: 0 }) }
          );
        }
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Background Blur & Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,42,0.1)_0%,rgba(10,10,12,1)_70%)]" />
        <AuraParticles variant="dark" className="opacity-40" />
      </div>

      {/* Login Card Popup */}
      <div 
        ref={modalRef}
        className="relative z-10 w-full max-w-4xl bg-aura-surface border border-aura-line rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[520px] opacity-0"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Left Side - Animated Logo & Brand */}
        <div 
          className="md:w-5/12 bg-[#0A0A0C] p-10 md:p-12 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-aura-line"
        >
          {/* Animated Gradient Glow */}
          <div 
            ref={logoContainerRef}
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, var(--aura-gold) 0%, transparent 70%)',
              backgroundSize: '200% 200%',
              transform: 'scale(1.2)'
            }}
          />
          
          <div ref={leftPanelRef} className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="w-28 h-28 rounded-full border border-aura-gold/40 flex items-center justify-center relative bg-[#0A0A0C]/60 backdrop-blur-md shadow-[0_0_30px_rgba(212,160,42,0.2)]">
              <div className="absolute inset-0 rounded-full border-t-2 border-aura-gold animate-spin" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-2 rounded-full border-b-2 border-aura-gold/50 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }} />
              <ShieldCheck className="w-12 h-12 text-aura-gold" />
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/5 px-6 py-4 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
                <AuraWordmark size="medium" layout="vertical" markVariant="dark" />
              </div>
              <p className="text-[9px] tracking-[0.4em] text-aura-gold uppercase font-bold mt-6 text-center shadow-black">
                Authorized Personnel Only
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-7/12 p-8 sm:p-12 md:p-14 bg-aura-surface flex flex-col justify-center relative">
          {/* Subtle noise/texture overlay for the right panel */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10">
            <div className="space-y-3 mb-10">
              <h2 className="font-serif text-4xl font-bold text-aura-ink">Welcome Back</h2>
              <p className="text-aura-subink text-sm">Please authenticate to access the AURA CMS.</p>
            </div>

            {errorMsg && (
              <div className="mb-8 p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-500 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-aura-subink ml-1">Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@auramenswear.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-aura-elevated border border-aura-line text-aura-ink pl-12 pr-4 py-4 rounded-xl text-sm focus:outline-none focus:border-aura-gold transition-colors placeholder:text-aura-subink/50 shadow-inner"
                  />
                  <Mail className="w-5 h-5 text-aura-subink absolute left-4 top-4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-aura-subink ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-aura-elevated border border-aura-line text-aura-ink pl-12 pr-4 py-4 rounded-xl text-sm focus:outline-none focus:border-aura-gold transition-colors placeholder:text-aura-subink/50 shadow-inner"
                  />
                  <Lock className="w-5 h-5 text-aura-subink absolute left-4 top-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-aura-gold-soft transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(212,160,42,0.3)] hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
