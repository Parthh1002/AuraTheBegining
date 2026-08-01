import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import { Search as SearchIcon } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  let products: any[] = [];
  if (query) {
    try {
      const data = await fetchApi(`/products?search=${encodeURIComponent(query)}`);
      products = (data || []).map((p: any) => {
        const primaryImg = p.product_images?.find((img: any) => img.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
        return {
          ...p,
          cover_image: primaryImg,
          collections: { name: p.collection_name },
        };
      });
    } catch (e) {
      console.warn('Could not perform search:', e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-aura-line pb-6 space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">SEARCH RESULTS</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-aura-cream">
          {query ? `Results for "${query}"` : 'Search AURA Catalog'}
        </h1>
      </div>

      <form action="/search" method="GET" className="max-w-xl flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search sherwani, tuxedo, suit, linen, silk..."
            className="w-full bg-aura-panel border border-aura-line text-aura-cream pl-10 pr-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
          />
          <SearchIcon className="w-4 h-4 text-aura-muted absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-aura-gold-soft transition-colors cursor-pointer shadow-md"
        >
          Search
        </button>
      </form>

      {query ? (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Results Found"
            description={`We couldn't find any designs matching "${query}". Try searching for sherwani, suit, bandhgala, or linen.`}
          />
        )
      ) : (
        <div className="text-aura-muted text-xs py-8">Enter a search keyword above to explore designs.</div>
      )}
    </div>
  );
}
