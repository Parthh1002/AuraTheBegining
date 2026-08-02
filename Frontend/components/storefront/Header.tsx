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

  // Scroll GSAP Animation for Pill Shape
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        if (navContainerRef.current) {
          gsap.to(navContainerRef.current, {
            duration: 0.4,
            backgroundColor: scrolled ? 'color-mix(in srgb, var(--aura-surface) 95%, transparent)' : 'transparent',
            boxShadow: scrolled ? 'var(--shadow-card-hover)' : 'none',
            backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
            border: scrolled ? '1px solid var(--aura-line)' : '1px solid transparent',
            borderRadius: scrolled ? '100px' : '0px',
            width: scrolled ? '95%' : '100%',
            maxWidth: scrolled ? '1100px' : '1400px',
            marginTop: scrolled ? '16px' : '0px',
            height: scrolled ? (window.innerWidth >= 768 ? 64 : 64) : (window.innerWidth >= 768 ? 88 : 72),
            paddingLeft: scrolled ? '32px' : '20px',
            paddingRight: scrolled ? '32px' : '20px',
            ease: 'power3.out',
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Init height
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
        className="fixed top-0 left-0 right-0 z-40 flex justify-center transition-colors pointer-events-none"
      >
        {/* Top gradient for non-scrolled state for legibility */}
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-aura-bg/60 to-transparent pointer-events-none -z-10 h-32" />
        )}
        
        <div 
          ref={navContainerRef}
          className="mx-auto flex items-center justify-between pointer-events-auto transition-all"
        >
          
          {/* Logo Mark + Brand Title (Left Aligned) */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="group block" onClick={() => setMobileMenuOpen(false)}>
              <AuraWordmark size={isScrolled ? "small" : "medium"} layout="horizontal" />
            </Link>
          </div>

          {/* Desktop Navigation Links (Center Aligned) */}
          <nav className="hidden lg:flex items-center justify-center flex-1" style={{ gap: '40px' }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group text-[11px] uppercase tracking-[0.08em] font-bold transition-colors py-2"
                  style={{ color: active ? 'var(--aura-gold-on-surface)' : 'var(--aura-ink)' }}
                >
                  <span className="group-hover:opacity-70 transition-opacity">{item.label}</span>
                  {/* Animated Active / Hover Underline */}
                  <span 
                    className="absolute left-0 -bottom-1 w-full h-[1.5px] origin-left transition-transform duration-300 ease-out"
                    style={{ 
                      background: 'var(--aura-gold-on-surface)',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  <span 
                    className={`absolute left-0 -bottom-1 w-full h-[1.5px] origin-left transition-transform duration-300 ease-out ${active ? 'hidden' : ''} scale-x-0 group-hover:scale-x-100`}
                    style={{ background: 'var(--aura-gold-on-surface)', opacity: 0.5 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Right Aligned) */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-aura-ink hover:text-aura-gold-on-surface transition-colors cursor-pointer group relative"
              aria-label="Search Catalog"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'color-mix(in srgb, var(--aura-gold) 10%, transparent)' }} />
              <Search className="w-4 h-4 relative z-10" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-aura-ink hover:text-aura-gold-on-surface transition-colors group"
              aria-label="Wishlist"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'color-mix(in srgb, var(--aura-gold) 10%, transparent)' }} />
              <Heart className="w-4 h-4 relative z-10" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-aura-gold text-[#0A0A0C] text-[10px] font-bold flex items-center justify-center z-20 border border-aura-surface">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full group cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-aura-ink hover:text-aura-gold-on-surface transition-colors cursor-pointer group relative ml-1"
              aria-label="Open Menu"
            >
              <div className="absolute inset-0 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" 
                   style={{ background: 'color-mix(in srgb, var(--aura-gold) 10%, transparent)' }} />
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
          style={{ background: '#0A0A0C' }} /* Always dark void */
        >
          {/* Header area inside menu */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <AuraWordmark size="small" layout="horizontal" markVariant="dark" />
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-[#D4A02A] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links Stagger */}
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

          {/* Footer info */}
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
        <div className="fixed inset-0 z-50 bg-aura-bg/95 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-aura-surface border border-aura-line rounded-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-aura-subink hover:text-aura-ink w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-aura-ink mb-4">Search AURA Collections</h3>

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
                placeholder="Search by suit, sherwani, bandhgala, fabric, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-aura-elevated border border-aura-line text-aura-ink px-4 py-3 rounded text-sm focus:outline-none focus:border-aura-gold placeholder:text-aura-subink"
              />
              <button
                type="submit"
                className="bg-aura-gold text-[#0A0A0C] px-6 py-3 font-bold text-xs uppercase tracking-widest rounded hover:bg-aura-gold-soft transition-colors cursor-pointer"
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
