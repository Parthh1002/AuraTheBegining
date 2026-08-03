import AdminShell from '@/components/admin/AdminShell';
import CollectionsAdminClient from './CollectionsAdminClient';

export const revalidate = 0;

export default function AdminCollectionsPage() {
  return (
    <AdminShell>
      <CollectionsAdminClient />
    </AdminShell>
  );
}