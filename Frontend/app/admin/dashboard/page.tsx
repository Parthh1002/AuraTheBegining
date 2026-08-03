import AdminShell from '@/components/admin/AdminShell';
import DashboardClient from './DashboardClient';

export const revalidate = 0;

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardClient />
    </AdminShell>
  );
}