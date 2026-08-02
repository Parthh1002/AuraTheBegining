import AdminSidebar from '@/components/admin/AdminSidebar';
import CollectionsAdminClient from './CollectionsAdminClient';

export const revalidate = 0;

export default function AdminCollectionsPage() {
  return (
    <div className="flex min-h-screen bg-aura-bg">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <CollectionsAdminClient />
      </main>
    </div>
  );
}
