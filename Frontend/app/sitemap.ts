import { MetadataRoute } from 'next';
import { fetchApi } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://auramenswear.com';

  let collections: any[] = [];
  let products: any[] = [];

  try {
    collections = await fetchApi('/collections');
  } catch (e) {}

  try {
    products = await fetchApi('/products');
  } catch (e) {}

  const collectionEntries: MetadataRoute.Sitemap = (collections || []).map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(col.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = (products || []).map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/lookbook`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/visit-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...collectionEntries,
    ...productEntries,
  ];
}
