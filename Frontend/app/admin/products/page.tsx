import AdminShell from '@/components/admin/AdminShell';
import ProductsAdminClient from './ProductsAdminClient';

export const revalidate = 0;

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ProductsAdminClient />
    </AdminShell>
  );
}