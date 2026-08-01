'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Menu, X, MapPin, Phone } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AuraLogoMark from '@/components/ui/AuraLogoMark';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Wishlist count listener
  useEffect(() => {
    const updateWishlist = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aura-wishlist');
        if (saved) {
          try {
            const arr = JSON.parse(saved);
            setWishlistCount(Array.isArray(arr) ? arr.length : 0);
          } catch {
            setWishlistCount(0);
          }
        } else {
          setWishlistCount(0);
        }
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

  // Header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-aura-panel/90 backdrop-blur-md border-b border-aura-line py-3 shadow-lg'
            : 'bg-gradient-to-b from-aura-void/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Mark + Brand Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <AuraLogoMark className="w-8 h-8 sm:w-9 sm:h-9 text-aura-gold group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-aura-cream group-hover:text-aura-gold transition-colors">
                AURA
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] text-aura-gold uppercase font-semibold -mt-1">
                THE BEGINNING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-aura-gold ${
                  pathname === item.href ? 'text-aura-gold font-semibold' : 'text-aura-cream/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-aura-cream/80 hover:text-aura-gold transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link with Badge */}
            <Link
              href="/wishlist"
              className="relative p-2 text-aura-cream/80 hover:text-aura-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-aura-gold text-[#0A0A0C] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Functional Theme Toggle (Dark / Light Mode) */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-aura-cream hover:text-aura-gold transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-aura-void/95 backdrop-blur-xl flex flex-col justify-between px-6 py-8 md:hidden">
          <div className="flex items-center justify-between border-b border-aura-line pb-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <AuraLogoMark className="w-8 h-8 text-aura-gold" />
              <div>
                <span className="font-serif text-2xl font-bold tracking-[0.25em] text-aura-cream">AURA</span>
                <span className="block text-[9px] tracking-[0.3em] text-aura-gold font-semibold">THE BEGINNING</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-aura-cream">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-6 my-auto text-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg uppercase tracking-[0.25em] font-medium transition-colors ${
                  pathname === item.href ? 'text-aura-gold' : 'text-aura-cream'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-aura-line pt-6 text-center space-y-3">
            <p className="text-xs text-aura-muted flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-aura-gold" /> GIDC, Dahegam, Gujarat 382305
            </p>
            <p className="text-xs text-aura-muted flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-aura-gold" /> +91 98765 43210
            </p>
          </div>
        </div>
      )}

      {/* Live Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-aura-void/95 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-aura-panel border border-aura-line rounded-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-aura-muted hover:text-aura-cream"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-aura-cream mb-4">Search AURA Collections</h3>

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
                className="flex-1 bg-aura-elevated border border-aura-line text-aura-cream px-4 py-3 rounded text-sm focus:outline-none focus:border-aura-gold"
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
