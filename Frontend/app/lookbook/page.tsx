import { fetchApi } from '@/lib/api';
import LookbookClient from './LookbookClient';

export const revalidate = 60;

export default async function LookbookPage() {
  let galleryItems: any[] = [];
  try {
    galleryItems = await fetchApi('/gallery');
  } catch (err) {
    console.warn('Could not fetch gallery:', err);
  }

  return <LookbookClient galleryItems={galleryItems || []} />;
}
