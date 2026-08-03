'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, FolderTree, MessageSquare,
  Image, Star, Settings, LogOut, Store, Menu, X,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AuraLogoMark from '@/components/ui/AuraLogoMark';

const navItems = [
  { label: 'Dashboard',        href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Products',         href: '/admin/products',     icon: ShoppingBag },
  { label: 'Collections',      href: '/admin/collections',  icon: FolderTree },
  { label: 'Enquiries',        href: '/admin/enquiries',    icon: MessageSquare },
  { label: 'Gallery',          href: '/admin/gallery',      icon: Image },
  { label: 'Testimonials',     href: '/admin/testimonials', icon: Star },
  { label: 'Settings',         href: '/admin/settings',     icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    localStorage.removeItem('aura-admin-token');
    document.cookie = 'aura-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
    router.refresh();
  };

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const currentLabel = navItems.find(i => i.href === pathname)?.label || 'Admin';

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE TOP HEADER BAR
      ══════════════════════════════════════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: 'rgba(10,10,12,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,160,42,0.15)',
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer"
          style={{ color: '#D4A02A' }}
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Page Title */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] tracking-[0.3em] uppercase font-bold" style={{ color: '#D4A02A' }}>AURA ADMIN</span>
          <span className="text-xs font-semibold text-white tracking-wider">{currentLabel}</span>
        </div>

        {/* Theme + Logo */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER OVERLAY
      ══════════════════════════════════════════ */}
      {mounted && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer Panel */}
          <div
            className={`lg:hidden fixed top-0 left-0 h-full z-[70] w-72 flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{
              background: 'rgba(12,12,15,0.98)',
              backdropFilter: 'blur(32px)',
              borderRight: '1px solid rgba(212,160,42,0.2)',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,160,42,0.12)', border: '1px solid rgba(212,160,42,0.3)' }}>
                  <AuraLogoMark className="w-5 h-5" style={{ color: '#D4A02A' }} />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-[0.2em] text-white">AURA</span>
                  <span className="text-[8px] tracking-[0.3em] font-bold uppercase" style={{ color: '#D4A02A' }}>CMS ADMIN</span>
                </div>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
                    style={{
                      background: isActive ? 'rgba(212,160,42,0.15)' : 'transparent',
                      color: isActive ? '#D4A02A' : 'rgba(255,255,255,0.65)',
                      border: isActive ? '1px solid rgba(212,160,42,0.3)' : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="tracking-wide">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="px-3 pb-8 pt-4 space-y-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                <Store className="w-4 h-4" />
                <span>View Storefront</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                style={{ color: 'rgba(239,68,68,0.8)' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR (Permanent)
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-4 h-[calc(100vh-32px)] my-4 ml-4 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'rgba(212,160,42,0.12)', border: '1px solid rgba(212,160,42,0.3)' }}
              >
                <AuraLogoMark className="w-5 h-5" style={{ color: '#D4A02A' }} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-white group-hover:text-[#D4A02A] transition-colors">
                  AURA
                </span>
                <span className="text-[8px] tracking-[0.3em] font-bold uppercase" style={{ color: '#D4A02A' }}>
                  CMS ADMIN PORTAL
                </span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Live indicator */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Live DB Sync</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 group relative overflow-hidden"
                style={{
                  background: isActive ? 'rgba(212,160,42,0.12)' : 'transparent',
                  color: isActive ? '#D4A02A' : 'rgba(255,255,255,0.55)',
                  border: isActive ? '1px solid rgba(212,160,42,0.25)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 20px rgba(212,160,42,0.08)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 pb-5 pt-4 space-y-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-colors group"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4A02A'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,42,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Store className="w-4 h-4" />
            <span>View Live Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            style={{ color: 'rgba(239,68,68,0.65)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgb(239,68,68)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.65)'; }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
