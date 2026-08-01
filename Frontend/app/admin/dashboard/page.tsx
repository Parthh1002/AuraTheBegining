import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardClient from './DashboardClient';

export const revalidate = 0;

export default function AdminDashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-aura-void text-aura-cream transition-colors">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <DashboardClient />
      </main>
    </div>
  );
}
