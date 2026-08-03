import AdminShell from '@/components/admin/AdminShell';
import GalleryAdminClient from './GalleryAdminClient';

export const revalidate = 0;

export default function AdminGalleryPage() {
  return (
    <AdminShell>
      <GalleryAdminClient />
    </AdminShell>
  );
}