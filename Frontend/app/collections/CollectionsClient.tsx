'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, SlidersHorizontal, Sparkles, Search, X } from 'lucide-react';

/* ── Custom luxury SVG symbols ── */
const IconAll = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="2.52" y1="2.52" x2="11.48" y2="11.48" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="11.48" y1="2.52" x2="2.52" y2="11.48" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconWedding = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1L8.2 4.5H12L9 6.7L10.2 10.2L7 8L3.8 10.2L5 6.7L2 4.5H5.8L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="7" cy="7" r="1.2" fill="currentColor" opacity="0.5"/>
  </svg>
);

const IconFormals = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 1.5L7 4L9 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 1.5L3.5 5H10.5L9 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 5L7 12.5L8.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconGenZ = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 1.5L4 7.5H7.5L5.5 12.5L10 6.5H6.5L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCasual = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2C7 2 4 4.5 4 7C4 9.2 5.8 11 7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M7 2C7 2 10 4.5 10 7C10 9.2 8.2 11 7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4.5 5.5C5.5 6 6.5 6 7.5 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M4 8C5 8.5 6 8.5 7.5 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <line x1="7" y1="11" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
import ScrollReveal from '@/components/animation/ScrollReveal';
import EmptyState from '@/components/ui/EmptyState';

interface Collection {
  id: string;
  name: string;
  slug: string;
  tag_category?: string;
  description?: string;
  cover_image_url?: string;
  product_count?: number;
  is_featured?: boolean;
}

const CATEGORY_FILTERS = [
  { key: 'all',     label: 'All',                Icon: IconAll     },
  { key: 'wedding', label: 'Wedding & Ethnic',   Icon: IconWedding },
  { key: 'formals', label: 'Formals & Suits',    Icon: IconFormals },
  { key: 'genz',    label: 'Gen-Z & Streetwear', Icon: IconGenZ    },
  { key: 'casual',  label: 'Casual & Linen',     Icon: IconCasual  },
];

export default function CollectionsClient({
  initialCollections,
}: {
  initialCollections: Collection[];
}) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Real-time polling
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://aurathebegining.onrender.com/api'}/collections`,
          { cache: 'no-store' }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setCollections(data);
        }
      } catch { /* Keep current data */ }
    };
    const interval = setInterval(fetchLatest, 8000);
    return () => clearInterval(interval);
  }, []);

  // Lock body when bottom sheet open
  useEffect(() => {
    if (filterSheetOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [filterSheetOpen]);

  const filteredCollections = useMemo(() => {
    let result = [...collections];
    if (activeFilter !== 'all') result = result.filter((c) => c.tag_category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.tag_category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [collections, activeFilter, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: collections.length };
    collections.forEach((c) => {
      const cat = c.tag_category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [collections]);

  const activeLabel = CATEGORY_FILTERS.find(c => c.key === activeFilter)?.label;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-14 space-y-6 sm:space-y-10">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-aura-elevated/60 backdrop-blur-sm border border-aura-line px-4 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-aura-gold" />
          <span className="text-[11px] font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">
            Discover Our Range
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-aura-cream font-bold leading-tight">
          All Collections
        </h1>
        <p className="text-sm text-aura-muted leading-relaxed max-w-xl mx-auto">
          From opulent wedding sherwanis to Gen-Z streetwear &amp; contemporary double-breasted suits — explore {collections.length} curated categories.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE TOOLBAR  (< sm)
          ══════════════════════════════════════════════ */}
      <div className="sm:hidden flex items-center gap-2">
        {/* Filter button */}
        <button
          onClick={() => setFilterSheetOpen(true)}
          className="flex items-center gap-2 flex-1 px-4 py-3.5 rounded-2xl border border-aura-line text-sm font-semibold text-aura-cream bg-aura-panel/90 cursor-pointer active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-4 h-4 text-aura-gold flex-shrink-0" />
          <span className="flex-1 text-left">
            {activeFilter !== 'all' ? (
              <span style={{ color: '#D4A02A' }}>{activeLabel}</span>
            ) : 'All Categories'}
          </span>
          {activeFilter !== 'all' && (
            <span className="w-5 h-5 rounded-full bg-[#D4A02A] text-[#0A0A0C] text-[10px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
          )}
        </button>

        {/* Search button */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-aura-line text-aura-cream bg-aura-panel/90 cursor-pointer active:scale-95 transition-transform"
          aria-label={isSearchOpen ? 'Close search' : 'Search'}
        >
          {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile search input */}
      {isSearchOpen && (
        <div className="sm:hidden relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-aura-elevated border border-aura-line text-aura-cream pl-11 pr-10 rounded-xl focus:outline-none focus:border-aura-gold transition-all"
            style={{ fontSize: '16px', padding: '14px 16px 14px 44px' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-aura-muted cursor-pointer w-8 h-8 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Mobile count row */}
      <div className="sm:hidden flex items-center justify-between text-xs text-aura-muted px-1">
        <span>
          Showing <strong className="text-aura-cream">{filteredCollections.length}</strong> of {collections.length} collections
        </span>
        {(activeFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
            className="text-aura-gold font-bold uppercase tracking-wider text-[10px] cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP FILTER BAR  (>= sm)
          ══════════════════════════════════════════════ */}
      <div className="hidden sm:block bg-aura-panel/80 backdrop-blur-md border border-aura-line rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <SlidersHorizontal className="w-4 h-4 text-aura-gold flex-shrink-0" />
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeFilter === cat.key;
              const count = categoryCounts[cat.key] || 0;
              const Icon = cat.Icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition-all duration-300 font-semibold tracking-wide cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-aura-gold text-[#0A0A0C] shadow-lg shadow-aura-gold/20 scale-105'
                      : 'bg-aura-elevated/80 text-aura-cream hover:bg-aura-elevated hover:text-aura-gold border border-aura-line/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#0A0A0C]/20 text-[#0A0A0C]' : 'bg-aura-void/60 text-aura-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(''); }}
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-aura-elevated border border-aura-line text-aura-cream hover:text-aura-gold hover:border-aura-gold transition-colors cursor-pointer flex-shrink-0"
          >
            {isSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isSearchOpen ? 'Close' : 'Search'}</span>
          </button>
        </div>

        {isSearchOpen && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-muted" />
            <input
              type="search"
              placeholder="Search collections (e.g. Gen-Z, Wedding, Denim, Kurta...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-aura-elevated border border-aura-line text-aura-cream pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold/30 placeholder:text-aura-muted/60 transition-all"
              style={{ fontSize: '16px' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-gold cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-aura-muted">
          <span>
            Showing <strong className="text-aura-cream">{filteredCollections.length}</strong> of {collections.length} collections
            {activeFilter !== 'all' && <span className="text-aura-gold ml-1">in {activeLabel}</span>}
          </span>
          {(activeFilter !== 'all' || searchQuery) && (
            <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="text-aura-gold hover:underline cursor-pointer uppercase tracking-wider font-bold text-[10px]">
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE FILTER BOTTOM-SHEET
          ══════════════════════════════════════════════ */}
      {filterSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setFilterSheetOpen(false)}
          />
          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 sm:hidden rounded-t-3xl flex flex-col"
            style={{
              background: 'rgba(14,14,18,0.99)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderBottom: 'none',
              paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-5 pb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-white font-bold">Filter by Category</h3>
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="px-4 pb-4 space-y-2">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = activeFilter === cat.key;
                const count = categoryCounts[cat.key] || 0;
                const Icon = cat.Icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => { setActiveFilter(cat.key); setFilterSheetOpen(false); }}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 cursor-pointer text-left active:scale-[0.98]"
                    style={{
                      background: isActive ? 'rgba(212,160,42,0.12)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? '1px solid rgba(212,160,42,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: isActive ? 'rgba(212,160,42,0.2)' : 'rgba(255,255,255,0.06)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: isActive ? '#D4A02A' : 'rgba(255,255,255,0.45)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: isActive ? '#D4A02A' : 'rgba(255,255,255,0.9)' }}>
                        {cat.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {count} {count === 1 ? 'collection' : 'collections'}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-[#D4A02A] flex items-center justify-center shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          COLLECTIONS GRID
          ══════════════════════════════════════════════ */}
      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredCollections.map((col, idx) => {
            const productCount = col.product_count || 0;
            return (
              <ScrollReveal key={col.id} direction="up" delay={idx * 0.08}>
                <Link
                  href={`/collections/${col.slug}`}
                  className="group relative bg-aura-panel border border-aura-line hover:border-aura-gold rounded-2xl overflow-hidden shadow-xl transition-all duration-500 flex flex-col hover:shadow-aura-gold/10 hover:shadow-2xl hover:-translate-y-1 h-full"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] bg-aura-elevated overflow-hidden">
                    <Image
                      src={
                        col.cover_image_url ||
                        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={col.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-panel via-transparent to-transparent opacity-80" />

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {col.is_featured && (
                        <span className="bg-aura-gold/90 backdrop-blur-sm text-[#0A0A0C] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-md">
                          Featured
                        </span>
                      )}
                      <span className="bg-aura-void/80 backdrop-blur-sm text-aura-gold border border-aura-line text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm">
                        {productCount} {productCount === 1 ? 'Design' : 'Designs'}
                      </span>
                    </div>

                    {/* Category tag */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-aura-void/70 backdrop-blur-md text-aura-cream/80 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase border border-aura-line/40">
                        {col.tag_category || 'collection'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 space-y-2 flex-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-aura-cream group-hover:text-aura-gold transition-colors leading-tight">
                      {col.name}
                    </h3>
                    <p className="text-xs text-aura-muted leading-relaxed line-clamp-2">{col.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                    <div className="flex items-center justify-between border-t border-aura-line pt-4">
                      <span className="text-xs uppercase tracking-widest font-bold text-aura-gold group-hover:tracking-[0.2em] transition-all">
                        Explore Category
                      </span>
                      <div className="w-8 h-8 rounded-full bg-aura-elevated border border-aura-line group-hover:bg-aura-gold group-hover:border-aura-gold flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-aura-gold group-hover:text-[#0A0A0C] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Matching Collections"
          description="Try adjusting your filter or search to explore our luxury men's categories."
        />
      )}
    </div>
  );
}
