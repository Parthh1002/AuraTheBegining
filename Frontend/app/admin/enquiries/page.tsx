import AdminShell from '@/components/admin/AdminShell';
import EnquiriesAdminClient from './EnquiriesAdminClient';

export const revalidate = 0;

export default function AdminEnquiriesPage() {
  return (
    <AdminShell>
      <EnquiriesAdminClient />
    </AdminShell>
  );
}