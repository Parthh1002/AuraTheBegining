import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';

export const revalidate = 60;

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    collections = await fetchApi('/collections');
  } catch (err) {
    console.warn('Could not fetch collections:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">DISCOVER OUR RANGE</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-cream font-bold">All Collections</h1>
        <p className="text-xs text-aura-muted leading-relaxed">
          From opulent wedding sherwanis to contemporary double-breasted suits and light linen casuals.
        </p>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col: any) => {
            const productCount = col.product_count || 0;
            return (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative bg-aura-panel border border-aura-line hover:border-aura-gold rounded-xl overflow-hidden shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[4/3] bg-aura-elevated overflow-hidden">
                  <Image
                    src={col.cover_image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'}
                    alt={col.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-aura-panel via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 right-4 bg-aura-void/80 backdrop-blur-sm text-aura-gold border border-aura-line text-[11px] font-bold tracking-widest px-3 py-1 rounded uppercase shadow-sm">
                    {productCount} {productCount === 1 ? 'Design' : 'Designs'}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-aura-cream group-hover:text-aura-gold transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-aura-muted leading-relaxed line-clamp-2">{col.description}</p>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-aura-line mt-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-aura-gold">
                    Explore Category
                  </span>
                  <ArrowRight className="w-4 h-4 text-aura-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No Collections Found" description="Check back soon for new category releases." />
      )}
    </div>
  );
}
