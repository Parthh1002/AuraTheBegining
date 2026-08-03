'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, SlidersHorizontal, Sparkles, Search, X } from 'lucide-react';
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
  { key: 'all', label: 'All', icon: '✦' },
  { key: 'wedding', label: 'Wedding & Ethnic', icon: '👑' },
  { key: 'formals', label: 'Formals & Suits', icon: '🤵' },
  { key: 'genz', label: 'Gen-Z & Streetwear', icon: '🔥' },
  { key: 'casual', label: 'Casual & Linen', icon: '🌿' },
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

  // Real-time polling — refresh data every 8 seconds from API
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://aurathebegining.onrender.com/api'}/collections`,
          { cache: 'no-store' }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCollections(data);
          }
        }
      } catch {
        // Keep using current data
      }
    };
    const interval = setInterval(fetchLatest, 8000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Search Logic
  const filteredCollections = useMemo(() => {
    let result = [...collections];

    // Category filter
    if (activeFilter !== 'all') {
      result = result.filter((c) => c.tag_category === activeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.tag_category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [collections, activeFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: collections.length };
    collections.forEach((c) => {
      const cat = c.tag_category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [collections]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-10 sm:py-14 space-y-10">
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
          From opulent wedding sherwanis to Gen-Z streetwear & contemporary double-breasted suits — explore {collections.length} curated categories.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-aura-panel/80 backdrop-blur-md border border-aura-line rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <SlidersHorizontal className="w-4 h-4 text-aura-gold flex-shrink-0" />
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeFilter === cat.key;
              const count = categoryCounts[cat.key] || 0;
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
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#0A0A0C]/20 text-[#0A0A0C]'
                        : 'bg-aura-void/60 text-aura-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Toggle */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-aura-elevated border border-aura-line text-aura-cream hover:text-aura-gold hover:border-aura-gold transition-colors cursor-pointer flex-shrink-0"
          >
            {isSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSearchOpen ? 'Close' : 'Search'}</span>
          </button>
        </div>

        {/* Search Input (expandable) */}
        {isSearchOpen && (
          <div className="relative animate-in slide-in-from-top-2 duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-muted" />
            <input
              type="text"
              placeholder="Search collections (e.g. Gen-Z, Wedding, Denim, Kurta...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-aura-elevated border border-aura-line text-aura-cream text-sm pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-aura-gold focus:ring-1 focus:ring-aura-gold/30 placeholder:text-aura-muted/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-gold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Active filter summary */}
        <div className="flex items-center justify-between text-xs text-aura-muted">
          <span>
            Showing <strong className="text-aura-cream">{filteredCollections.length}</strong> of{' '}
            {collections.length} collections
            {activeFilter !== 'all' && (
              <span className="text-aura-gold ml-1">
                in {CATEGORY_FILTERS.find((c) => c.key === activeFilter)?.label}
              </span>
            )}
          </span>
          {(activeFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="text-aura-gold hover:underline cursor-pointer uppercase tracking-wider font-bold"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCollections.map((col, idx) => {
            const productCount = col.product_count || 0;
            return (
              <ScrollReveal key={col.id} direction="up" delay={idx * 0.1}>
                <Link
                  href={`/collections/${col.slug}`}
                  className="group relative bg-aura-panel border border-aura-line hover:border-aura-gold rounded-2xl overflow-hidden shadow-xl transition-all duration-500 flex flex-col justify-between hover:shadow-aura-gold/10 hover:shadow-2xl hover:-translate-y-1 block h-full"
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
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-panel via-transparent to-transparent opacity-80" />

                    {/* Badges Row */}
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

                    {/* Category Tag */}
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
                  <p className="text-xs text-aura-muted leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
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
          description="Try adjusting your filter or search query to explore our luxury men's categories."
        />
      )}
    </div>
  );
}
