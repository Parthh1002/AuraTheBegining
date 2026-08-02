import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, Star, Clock, Sparkles } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import MagneticButton from '@/components/animation/MagneticButton';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import ScrollReveal from '@/components/animation/ScrollReveal';
import AuraParticles from '@/components/animation/AuraParticles';
import FAQSection from '@/components/storefront/FAQSection';

export const revalidate = 60;

export default async function HomePage() {
  /* ── Data fetching ─────────────────────────────── */
  let settings: any = null;
  try { settings = await fetchApi('/settings'); } catch {}

  let newArrivals: any[] = [];
  try { newArrivals = await fetchApi('/products?tag=new-arrival&limit=8'); } catch {}

  let featuredCollections: any[] = [];
  try {
    const cols = await fetchApi('/collections');
    featuredCollections = (cols || []).filter((c: any) => c.is_featured);
  } catch {}

  let galleryTeaser: any[] = [];
  try {
    const gallery = await fetchApi('/gallery');
    galleryTeaser = (gallery || []).slice(0, 6);
  } catch {}

  let testimonials: any[] = [];
  try { testimonials = await fetchApi('/testimonials'); } catch {}

  /* ── Derived values ────────────────────────────── */
  const heroHeadline  = settings?.hero_headline  || 'Elegance Emerges from Darkness';
  const heroSubtext   = settings?.hero_subtext   || 'Discover bespoke tailoring, royal silk sherwanis, obsidian bandhgalas, and modern luxury apparel.';
  const storeAddress  = settings?.store_address  || 'Shop no 2, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';
  const whatsappNum   = settings?.whatsapp_number|| '919876543210';
  const heroMediaUrl  = settings?.hero_media_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop';

  const formattedArrivals = (newArrivals || []).map((p: any) => ({
    ...p,
    cover_image: p.product_images?.find((i: any) => i.is_primary)?.storage_path || p.product_images?.[0]?.storage_path,
  }));

  const directionsUrl = `https://www.google.com/maps/place/AURA+(The+beginning)+MENS+WEAR/@23.16286593494573,72.80827951499718,19z`;
  const mapEmbedUrl   = `https://maps.google.com/maps?q=AURA%20(The%20beginning)%20MENS%20WEAR,%20Dahegam,%20Gujarat&t=k&hl=en&z=20&output=embed`;
  const whatsappUrl   = buildGeneralWhatsAppUrl(whatsappNum);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden border-b border-aura-line">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroMediaUrl}
            alt="AURA Hero"
            fill priority
            className="object-cover object-[75%_30%] sm:object-right"
            sizes="100vw"
          />

          {/* Desktop — left fade */}
          <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block" style={{
            background: 'linear-gradient(to right, var(--aura-bg) 10%, color-mix(in srgb,var(--aura-bg) 82%,transparent) 28%, color-mix(in srgb,var(--aura-bg) 55%,transparent) 48%, color-mix(in srgb,var(--aura-bg) 22%,transparent) 66%, transparent 100%)',
          }} />

          {/* Mobile — top+bottom fade */}
          <div className="absolute inset-0 z-10 pointer-events-none sm:hidden" style={{
            background: 'linear-gradient(to bottom, var(--aura-bg) 0%, color-mix(in srgb,var(--aura-bg) 60%,transparent) 25%, color-mix(in srgb,var(--aura-bg) 20%,transparent) 55%, transparent 75%)',
          }} />
          <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-aura-bg to-transparent pointer-events-none" />

          {/* Ambient glow & Signature Particles */}
          <div className="absolute left-[15%] top-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,160,42,0.15)_0%,transparent_70%)] pointer-events-none z-10" />
          <AuraParticles variant="light" className="z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-28 pb-20 sm:pt-0 sm:pb-0">
          <div className="max-w-lg lg:max-w-xl space-y-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-[11px] font-sans tracking-[0.22em] font-bold uppercase shadow-lg"
              style={{ background: 'rgba(251,248,242,0.85)', borderColor: 'var(--aura-line)', color: 'var(--aura-gold-on-surface)' }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--aura-gold)' }} />
              Dahegam&apos;s Premier Boutique
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold tracking-tight text-aura-ink leading-[1.08] drop-shadow-sm"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}>
              {heroHeadline}
            </h1>

            {/* Subtext */}
            <p className="font-sans text-sm sm:text-base leading-relaxed max-w-md font-medium"
              style={{ color: 'var(--aura-subink)' }}>
              {heroSubtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <MagneticButton>
                <Link href="/collections"
                  className="group relative inline-flex items-center justify-center gap-2.5 font-semibold text-xs uppercase tracking-[0.22em] px-9 py-4 rounded-sm overflow-hidden transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_28px_rgba(201,162,39,0.55)]"
                  style={{ background: 'var(--aura-gold)', color: '#0A0A0C' }}>
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </MagneticButton>

              <Link href={whatsappUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 font-semibold text-xs uppercase tracking-[0.22em] px-8 py-4 rounded-sm transition-all duration-200 shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                style={{ background: '#25D366', borderColor: '#25D366', color: '#fff', border: '1px solid #25D366' }}>
                <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                Enquire on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. NEW ARRIVALS
          ══════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="section-gap-xl max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b pb-6" style={{ borderColor: 'var(--aura-line)' }}>
            <div>
              <p className="text-[11px] font-sans tracking-[0.28em] font-bold uppercase mb-1" style={{ color: 'var(--aura-gold-on-surface)' }}>
                Curated Exclusives
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: 'var(--aura-ink)' }}>New Arrivals</h2>
            </div>
            <Link href="/collections"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-bold transition-colors hover:opacity-70 shrink-0"
              style={{ color: 'var(--aura-gold-on-surface)' }}>
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {formattedArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {formattedArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-sm" style={{ color: 'var(--aura-subink)' }}>
              New seasonal garments arriving soon. Explore our full collections.
            </p>
          )}
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════
          3. FEATURED COLLECTIONS
          ══════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="section-gap-xl max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <p className="text-[11px] font-sans tracking-[0.28em] font-bold uppercase" style={{ color: 'var(--aura-gold-on-surface)' }}>
              Category Selections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: 'var(--aura-ink)' }}>Featured Collections</h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--aura-subink)' }}>
              Tailored specifically for wedding galas, black-tie receptions, and refined daily luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {(featuredCollections || []).map((col) => (
              <Link key={col.id} href={`/collections/${col.slug}`}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border transition-all duration-500 shadow-lg flex flex-col justify-end p-6 hover:shadow-2xl"
                style={{ borderColor: 'var(--aura-line)' }}>
                <Image
                  src={col.cover_image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'}
                  alt={col.name} fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#D4A02A] transition-colors duration-200">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{col.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase font-bold tracking-widest pt-1" style={{ color: '#D4A02A' }}>
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════
          4. LOOKBOOK TEASER
          ══════════════════════════════════════════ */}
      {galleryTeaser.length > 0 && (
        <ScrollReveal direction="up" delay={0.1}>
          <section className="section-gap-xl border-y" style={{ background: 'var(--aura-surface)', borderColor: 'var(--aura-line)' }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <p className="text-[11px] font-sans tracking-[0.28em] font-bold uppercase mb-1" style={{ color: 'var(--aura-gold-on-surface)' }}>
                    Editorial Gallery
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold" style={{ color: 'var(--aura-ink)' }}>AURA Stories</h2>
                </div>
                <Link href="/lookbook"
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-bold transition-colors hover:opacity-70 shrink-0"
                  style={{ color: 'var(--aura-gold-on-surface)' }}>
                  Full Lookbook <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {galleryTeaser.map((item) => (
                  <div key={item.id}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden border group shadow-md"
                    style={{ borderColor: 'var(--aura-line)' }}>
                    <Image src={item.storage_path} alt={item.caption || 'AURA Lookbook'} fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                      {item.caption && (
                        <p className="text-[10px] font-serif text-white/90 leading-snug">{item.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ══════════════════════════════════════════
          5. TESTIMONIALS
          ══════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <ScrollReveal direction="up" delay={0.1}>
          <section className="section-gap-xl max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1" style={{ color: 'var(--aura-gold)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <h2 className="font-serif text-3xl font-bold" style={{ color: 'var(--aura-ink)' }}>5.0★ on Google</h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--aura-subink)' }}>
                What our distinguished clientele across Gujarat say about AURA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {testimonials.map((t) => (
                <div key={t.id}
                  className="card-resting rounded-xl p-6 space-y-4">
                  <div className="flex" style={{ color: 'var(--aura-gold)' }}>
                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'var(--aura-ink)', opacity: 0.85 }}>
                    &ldquo;{t.review_text}&rdquo;
                  </p>
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--aura-line)' }}>
                    <span className="font-serif text-sm font-bold block" style={{ color: 'var(--aura-gold-on-surface)' }}>{t.customer_name}</span>
                    <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--aura-subink)' }}>Verified Google Review</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ══════════════════════════════════════════
          6. STORE / MAP STRIP
          ══════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="section-gap-xl max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pb-24">
          <div className="card-resting rounded-2xl p-7 sm:p-10 lg:p-14 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute right-0 bottom-0 w-80 h-80 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(212,160,42,0.09) 0%, transparent 70%)' }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left — info */}
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-sans tracking-[0.28em] font-bold uppercase mb-1" style={{ color: 'var(--aura-gold-on-surface)' }}>
                    Boutique Store
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: 'var(--aura-ink)' }}>
                    Visit AURA (The Beginning)
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--aura-subink)' }}>
                  Step into our showroom at GIDC Dahegam to experience custom fittings, feel raw silk and wool swatches, and consult with our master tailors.
                </p>

                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--aura-gold-on-surface)' }} />
                    <span style={{ color: 'var(--aura-ink)', opacity: 0.85 }}>{storeAddress}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--aura-gold-on-surface)' }} />
                    <span style={{ color: 'var(--aura-ink)', opacity: 0.85 }}>Open Daily · 10:00 AM – 09:00 PM</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href={directionsUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-md"
                    style={{ background: 'var(--aura-gold)', color: '#0A0A0C' }}>
                    <MapPin className="w-4 h-4" /> Get Directions
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-md"
                    style={{ background: '#25D366', color: '#fff', border: 'none' }}>
                    <WhatsAppIcon className="w-5 h-5" /> WhatsApp Consultation
                  </a>
                </div>
              </div>

              {/* Right — map */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border shadow-lg"
                style={{ borderColor: 'var(--aura-line)' }}>
                <iframe
                  title="AURA Store Location"
                  src={mapEmbedUrl}
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════
          7. FAQ SECTION
          ══════════════════════════════════════════ */}
      <FAQSection />

    </div>
  );
}
