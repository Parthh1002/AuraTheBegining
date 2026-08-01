import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

import IntroOverlay from '@/components/animation/IntroOverlay';
import CursorGlow from '@/components/animation/CursorGlow';
import LenisProvider from '@/components/animation/LenisProvider';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
};

export const metadata: Metadata = {
  title: 'AURA (The Beginning) — Premium Men\'s Wear | Dahegam, Gujarat',
  description: 'Bespoke tailoring, silk sherwanis, obsidian bandhgalas, double-breasted suits, and luxury linen. Located at GIDC, Dahegam, Gujarat.',
  keywords: ['Aura mens wear', 'Dahegam suit store', 'Groom sherwani Dahegam', 'Bespoke suits Gujarat', 'Luxury mens fashion Dahegam'],
  authors: [{ name: 'AURA Mens Wear' }],
  openGraph: {
    title: 'AURA (The Beginning) — Premium Men\'s Wear',
    description: 'Bespoke suits, tuxedos, and wedding ethnic wear. Dahegam, Gujarat.',
    url: 'https://auramenswear.com',
    siteName: 'AURA (The Beginning)',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark`}>
      <body className="bg-aura-void text-aura-cream antialiased selection:bg-aura-gold selection:text-[#0A0A0C]">
        <LenisProvider>
          {/* Signature First-Load Intro Animation */}
          <IntroOverlay />

          {/* Desktop Subtle Amber Radial Cursor Follower */}
          <CursorGlow />

          {/* Site Navigation Header */}
          <Header />

          {/* Main Page Content */}
          <main className="min-h-screen pt-20">{children}</main>

          {/* Site Footer */}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
