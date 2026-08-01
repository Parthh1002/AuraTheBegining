import { fetchApi } from '@/lib/api';
import CollectionsClient from './CollectionsClient';

export const revalidate = 0;

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    collections = await fetchApi('/collections');
  } catch (err) {
    console.warn('Could not fetch collections:', err);
  }

  return <CollectionsClient initialCollections={collections} />;
}
