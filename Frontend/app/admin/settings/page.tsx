import AdminSidebar from '@/components/admin/AdminSidebar';
import SettingsAdminClient from './SettingsAdminClient';

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-aura-bg">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <SettingsAdminClient />
      </main>
    </div>
  );
}
