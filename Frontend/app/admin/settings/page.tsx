import AdminShell from '@/components/admin/AdminShell';
import SettingsAdminClient from './SettingsAdminClient';

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <SettingsAdminClient />
    </AdminShell>
  );
}