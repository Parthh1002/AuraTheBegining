import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let productRes: any = null;
  let settings: any = null;

  try {
    productRes = await fetchApi(`/products/${slug}`);
  } catch (err) {
    notFound();
  }

  try {
    settings = await fetchApi('/settings');
  } catch (err) {
    console.warn('Could not fetch settings:', err);
  }

  const { product, relatedProducts } = productRes;

  const formattedProduct = {
    ...product,
    collections: { id: product.collection_id, name: product.collection_name, slug: product.collection_slug },
  };

  const formattedRelated = (relatedProducts || []).map((p: any) => {
    const primaryImg = p.product_images?.find((img: any) => img.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
    return {
      ...p,
      cover_image: primaryImg,
    };
  });

  return (
    <ProductDetailClient
      product={formattedProduct}
      whatsappNumber={settings?.whatsapp_number || '918866077505'}
      relatedProducts={formattedRelated}
    />
  );
}
