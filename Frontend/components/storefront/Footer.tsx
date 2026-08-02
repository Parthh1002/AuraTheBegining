'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui/SocialIcons';

export default function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  if (pathname.startsWith('/admin')) return null;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    setNewsletterMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterMsg('Subscription link sent! Please check your email inbox to confirm.');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="dark bg-aura-bg border-t border-aura-line text-aura-subink pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-aura-line">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-aura-cream">AURA</span>
              <span className="block text-[9px] tracking-[0.3em] text-aura-gold uppercase font-semibold">THE BEGINNING</span>
            </Link>
            <p className="text-xs leading-relaxed text-aura-muted">
              Where light emerges from darkness. Premium men clothing boutique in Dahegam offering bespoke bandhgalas, tuxedos, silk sherwanis, and casual luxury linen.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-aura-line flex items-center justify-center text-aura-cream hover:border-aura-gold hover:text-aura-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-aura-line flex items-center justify-center text-aura-cream hover:border-aura-gold hover:text-aura-gold transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-aura-line flex items-center justify-center text-aura-cream hover:border-aura-gold hover:text-aura-gold transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-aura-cream tracking-wider uppercase font-semibold">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/collections/royal-ethnic" className="hover:text-aura-gold transition-colors">Royal Ethnic & Sherwanis</Link></li>
              <li><Link href="/collections/bespoke-suits" className="hover:text-aura-gold transition-colors">Bespoke Suits & Tuxedos</Link></li>
              <li><Link href="/collections/casual-luxury" className="hover:text-aura-gold transition-colors">Casual Luxury & Linen</Link></li>
              <li><Link href="/collections/kurtas-festives" className="hover:text-aura-gold transition-colors">Kurtas & Festives</Link></li>
              <li><Link href="/lookbook" className="hover:text-aura-gold transition-colors">AURA Stories / Lookbook</Link></li>
            </ul>
          </div>

          {/* Store Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-aura-cream tracking-wider uppercase font-semibold">Visit Boutique</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2 text-aura-cream/90">
                <MapPin className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
                <span>Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Compound, opp. Balmukund Prime, GIDC, Dahegam, Gujarat 382305</span>
              </p>
              <p className="flex items-center gap-2 text-aura-cream/90">
                <Phone className="w-4 h-4 text-aura-gold shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2 text-aura-cream/90">
                <Mail className="w-4 h-4 text-aura-gold shrink-0" />
                <span>contact@auramenswear.com</span>
              </p>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-aura-cream tracking-wider uppercase font-semibold">AURA Journal</h4>
            <p className="text-xs text-aura-muted">
              Subscribe for exclusive previews of new seasonal collections and style guides.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full bg-aura-panel border border-aura-line rounded px-3 py-2 text-xs text-aura-cream focus:outline-none focus:border-aura-gold"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-aura-gold text-[#0A0A0C] rounded text-xs font-bold hover:bg-aura-gold-soft transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {newsletterMsg && (
                <p className={`text-[11px] mt-1 ${newsletterStatus === 'success' ? 'text-aura-gold' : 'text-red-400'}`}>
                  {newsletterMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-aura-muted">
          <p>© {new Date().getFullYear()} AURA (The Beginning) MENS WEAR. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/admin/login" className="hover:text-aura-gold transition-colors">Admin Portal</Link>
            <Link href="/visit-us" className="hover:text-aura-gold transition-colors">Store Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
