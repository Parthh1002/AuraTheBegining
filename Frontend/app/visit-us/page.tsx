import { fetchApi } from '@/lib/api';
import VisitUsClient from './VisitUsClient';

export const revalidate = 60;

export default async function VisitUsPage() {
  let settings: any = null;
  try {
    settings = await fetchApi('/settings');
  } catch (e) {
    console.warn('Could not fetch settings:', e);
  }

  const storeAddress = settings?.store_address || 'Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';
  const storePhone = settings?.store_phone || '+91 98765 43210';
  const whatsappNumber = settings?.whatsapp_number || '919876543210';
  const storeHours = settings?.store_hours || {
    monday: { open: '10:00 AM', close: '09:00 PM', closed: false },
    tuesday: { open: '10:00 AM', close: '09:00 PM', closed: false },
    wednesday: { open: '10:00 AM', close: '09:00 PM', closed: false },
    thursday: { open: '10:00 AM', close: '09:00 PM', closed: false },
    friday: { open: '10:00 AM', close: '09:00 PM', closed: false },
    saturday: { open: '10:00 AM', close: '09:30 PM', closed: false },
    sunday: { open: '10:30 AM', close: '09:00 PM', closed: false },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'AURA (The Beginning) MENS WEAR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop no 2, plot, AURA (The Beginning), GIDC',
      addressLocality: 'Dahegam',
      addressRegion: 'Gujarat',
      postalCode: '382305',
      addressCountry: 'IN',
    },
    telephone: storePhone,
    url: 'https://auramenswear.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VisitUsClient
        storeAddress={storeAddress}
        storePhone={storePhone}
        whatsappNumber={whatsappNumber}
        storeHours={storeHours}
      />
    </>
  );
}
