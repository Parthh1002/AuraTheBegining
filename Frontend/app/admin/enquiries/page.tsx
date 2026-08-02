import AdminSidebar from '@/components/admin/AdminSidebar';
import EnquiriesAdminClient from './EnquiriesAdminClient';

export const revalidate = 0;

export default function AdminEnquiriesPage() {
  return (
    <div className="flex min-h-screen bg-aura-bg">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <EnquiriesAdminClient />
      </main>
    </div>
  );
}
