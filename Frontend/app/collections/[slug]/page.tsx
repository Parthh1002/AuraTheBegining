import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import CategoryListingClient from './CategoryListingClient';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let collection: any = null;
  let products: any[] = [];

  try {
    collection = await fetchApi(`/collections/${slug}`);
  } catch (err) {
    notFound();
  }

  try {
    products = await fetchApi(`/products?collection_slug=${slug}`);
  } catch (err) {
    console.warn('Could not fetch products for collection:', err);
  }

  const formattedProducts = (products || []).map((p: any) => {
    const primaryImg = p.product_images?.find((img: any) => img.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
    return {
      ...p,
      cover_image: primaryImg,
      collections: { name: collection?.name },
    };
  });

  return <CategoryListingClient collection={collection} initialProducts={formattedProducts} />;
}
