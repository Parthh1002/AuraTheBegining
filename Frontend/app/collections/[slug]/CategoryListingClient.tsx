'use client';

import { useState, useMemo } from 'react';
import ProductCard, { ProductCardData } from '@/components/product/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface CategoryListingClientProps {
  collection: {
    name: string;
    description?: string;
  };
  initialProducts: (ProductCardData & { sizes?: string[]; tags?: string[]; created_at?: string })[];
}

export default function CategoryListingClient({
  collection,
  initialProducts,
}: CategoryListingClientProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract distinct sizes across all products in this collection
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    initialProducts.forEach((p) => {
      p.sizes?.forEach((s) => sizeSet.add(s));
    });
    return Array.from(sizeSet).sort();
  }, [initialProducts]);

  // Distinct tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialProducts.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [initialProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Size Filter
        if (selectedSizes.length > 0) {
          const hasSize = p.sizes?.some((s) => selectedSizes.includes(s));
          if (!hasSize) return false;
        }

        // Tag Filter
        if (selectedTag !== 'all') {
          if (!p.tags?.includes(selectedTag)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [initialProducts, selectedSizes, selectedTag, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Category Header */}
      <div className="border-b border-aura-line pb-8 space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">COLLECTION</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-cream font-bold">{collection.name}</h1>
        {collection.description && (
          <p className="text-xs text-aura-muted max-w-2xl leading-relaxed">{collection.description}</p>
        )}
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-aura-panel border border-aura-line p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aura-gold border border-aura-line px-3 py-2 rounded"
          >
            <Filter className="w-4 h-4" /> Filters {selectedSizes.length > 0 && `(${selectedSizes.length})`}
          </button>

          {/* Desktop Tag Pills */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-aura-muted font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-aura-gold" /> Tag:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`text-xs px-3 py-1.5 rounded transition-colors uppercase tracking-wider font-semibold cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-aura-gold text-[#0A0A0C]'
                  : 'bg-aura-elevated text-aura-cream hover:text-aura-gold'
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3 py-1.5 rounded transition-colors uppercase tracking-wider font-semibold cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-aura-gold text-[#0A0A0C]'
                    : 'bg-aura-elevated text-aura-cream hover:text-aura-gold'
                }`}
              >
                {tag.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-aura-muted font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-aura-elevated border border-aura-line text-aura-cream text-xs px-3 py-2 rounded focus:outline-none focus:border-aura-gold"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter Panel */}
        <div className={`space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'} lg:col-span-1`}>
          <div className="bg-aura-panel border border-aura-line rounded-xl p-6 space-y-6 shadow-md">
            <h3 className="font-serif text-lg text-aura-cream font-bold border-b border-aura-line pb-3 flex items-center justify-between">
              Filter Options
              {(selectedSizes.length > 0 || selectedTag !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedSizes([]);
                    setSelectedTag('all');
                  }}
                  className="text-[10px] text-aura-gold hover:underline uppercase font-sans tracking-widest cursor-pointer"
                >
                  Reset
                </button>
              )}
            </h3>

            {/* Size Filter Checkbox List */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-sans tracking-wider text-aura-gold uppercase font-bold block">
                  Select Size
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`text-xs py-2 rounded border transition-all text-center font-bold cursor-pointer ${
                          isSelected
                            ? 'bg-aura-gold text-[#0A0A0C] border-aura-gold'
                            : 'bg-aura-elevated text-aura-cream border-aura-line hover:border-aura-gold'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Matching Designs"
              description="Try adjusting your size or tag filters to explore other luxury pieces."
            />
          )}
        </div>
      </div>
    </div>
  );
}
