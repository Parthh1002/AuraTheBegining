'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Menu, X, MapPin, Phone } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AuraWordmark from '@/components/ui/AuraWordmark';
import gsap from 'gsap';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  // Wishlist count listener
  useEffect(() => {
    const updateWishlist = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aura-wishlist');
        if (saved) {
          try {
            const arr = JSON.parse(saved);
            setWishlistCount(Array.isArray(arr) ? arr.length : 0);
          } catch { setWishlistCount(0); }
        } else { setWishlistCount(0); }
      }
    };
    updateWishlist();
    window.addEventListener('storage', updateWishlist);
    window.addEventListener('aura-wishlist-updated', updateWishlist);
    return () => {
      window.removeEventListener('storage', updateWishlist);
      window.removeEventListener('aura-wishlist-updated', updateWishlist);
    };
  }, []);

  // Scroll GSAP Animation for Glass Pill Shape
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        if (navContainerRef.current) {
          gsap.to(navContainerRef.current, {
            duration: 0.45,
            borderRadius: scrolled ? '100px' : '0px',
            width: scrolled ? '92%' : '100%',
            maxWidth: scrolled ? '1100px' : '1400px',
            marginTop: scrolled ? '14px' : '0px',
            height: scrolled ? 64 : (window.innerWidth >= 768 ? 88 : 72),
            paddingLeft: scrolled ? '28px' : '20px',
            paddingRight: scrolled ? '28px' : '20px',
            ease: 'power3.out',
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    if (navContainerRef.current) {
      gsap.set(navContainerRef.current, {
        height: window.innerWidth >= 768 ? 88 : 72,
        paddingLeft: '20px',
        paddingRight: '20px',
        width: '100%',
        maxWidth: '1400px'
      });
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Mobile Menu Reveal GSAP
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current && mobileLinksRef.current) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(mobileLinksRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  if (pathname.startsWith('/admin')) return null;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'About', href: '/about' },
    { label: 'Visit Store', href: '/visit-us' },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      >
        {/* Strong dark gradient so text is ALWAYS readable over any background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isScrolled
              ? 'transparent'
              : 'linear-gradient(to bottom, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.35) 60%, transparent 100%)',
            transition: 'all 0.45s ease',
          }}
        />

        <div 
          ref={navContainerRef}
          className="mx-auto flex items-center justify-between pointer-events-auto relative"
          style={{
            background: isScrolled
              ? 'rgba(255,255,255,0.08)'
              : 'transparent',
            backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
            border: isScrolled ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
            boxShadow: isScrolled
              ? '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)'
              : 'none',
            transition: 'background 0.45s ease, border 0.45s ease, box-shadow 0.45s ease, backdrop-filter 0.45s ease',
          }}
        >
          
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="group block" onClick={() => setMobileMenuOpen(false)}>
              <AuraWordmark size={isScrolled ? "small" : "medium"} layout="horizontal" markVariant="dark" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1" style={{ gap: '40px' }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group text-[11px] uppercase tracking-[0.08em] font-bold transition-all duration-300 py-2"
                  style={{
                    color: active
                      ? '#D4A02A'
                      : '#ffffff',
                    textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  <span className="group-hover:opacity-75 transition-opacity">{item.label}</span>
                  {/* Active underline */}
                  <span 
                    className="absolute left-0 -bottom-1 w-full h-[1.5px] origin-left transition-transform duration-300 ease-out"
                    style={{ 
                      background: '#D4A02A',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {/* Hover underline */}
                  <span 
                    className={`absolute left-0 -bottom-1 w-full h-[1.5px] origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100 ${active ? 'hidden' : ''}`}
                    style={{ background: '#D4A02A', opacity: 0.5 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group relative"
              style={{ color: '#ffffff', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              aria-label="Search Catalog"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'rgba(212,160,42,0.2)' }} />
              <Search className="w-4 h-4 relative z-10" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group"
              style={{ color: '#ffffff' }}
              aria-label="Wishlist"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'rgba(212,160,42,0.2)' }} />
              <Heart className="w-4 h-4 relative z-10" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#D4A02A] text-[#0A0A0C] text-[10px] font-bold flex items-center justify-center z-20">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full group cursor-pointer hover:bg-white/10 transition-colors"
              style={{ color: '#ffffff' }}>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group relative ml-1"
              style={{ color: '#ffffff' }}
              aria-label="Open Menu"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'rgba(212,160,42,0.2)' }} />
              <Menu className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 flex flex-col justify-between"
          style={{
            background: 'rgba(10,10,12,0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <AuraWordmark size="small" layout="horizontal" markVariant="dark" />
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-[#D4A02A] transition-colors cursor-pointer rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav ref={mobileLinksRef} className="flex flex-col space-y-6 my-auto px-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl uppercase tracking-[0.2em] font-medium transition-colors ${
                  pathname === item.href ? 'text-[#D4A02A]' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-8 space-y-4">
            <p className="text-[11px] text-white/50 flex items-center gap-3 uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-[#D4A02A]" /> GIDC, Dahegam, Gujarat
            </p>
            <p className="text-[11px] text-white/50 flex items-center gap-3 uppercase tracking-widest">
              <Phone className="w-4 h-4 text-[#D4A02A]" /> +91 98765 43210
            </p>
          </div>
        </div>
      )}

      {/* ── SEARCH MODAL ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          style={{
            background: 'rgba(10,10,12,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-white mb-4">Search AURA Collections</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                  setSearchOpen(false);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Search by suit, sherwani, bandhgala, fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A02A] placeholder:text-white/40 text-white"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
              <button
                type="submit"
                className="bg-[#D4A02A] text-[#0A0A0C] px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#E8B84B] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
