'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderTree, MessageSquare, Image, Star, Settings, LogOut, Store, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AuraLogoMark from '@/components/ui/AuraLogoMark';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('aura-admin-token');
    document.cookie = 'aura-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Collections', href: '/admin/collections', icon: FolderTree },
    { label: 'Enquiries Inbox', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Gallery / Lookbook', href: '/admin/gallery', icon: Image },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Admin Header Bar */}
      <div className="md:hidden w-full bg-aura-surface border-b border-aura-line p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <AuraLogoMark className="w-7 h-7 text-aura-gold" />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-[0.2em] text-aura-ink">AURA</span>
            <span className="text-[8px] tracking-[0.25em] text-aura-gold uppercase font-bold">ADMIN PORTAL</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-aura-ink hover:text-aura-gold"
            aria-label="Toggle Admin Navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Panel */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-aura-surface border-r border-aura-line p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-aura-line pb-4">
            <Link href="/" className="flex items-center gap-3 group">
              <AuraLogoMark className="w-8 h-8 text-aura-gold group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-aura-ink group-hover:text-aura-gold transition-colors">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.3em] text-aura-gold uppercase font-semibold">
                  CMS ADMIN PORTAL
                </span>
              </div>
            </Link>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-aura-gold text-aura-bg font-bold shadow-md'
                      : 'text-aura-subink hover:bg-aura-elevated hover:text-aura-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-aura-line">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded text-xs text-aura-subink hover:text-aura-gold hover:bg-aura-elevated transition-colors"
          >
            <Store className="w-4 h-4" /> View Live Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-aura-bg/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
}
