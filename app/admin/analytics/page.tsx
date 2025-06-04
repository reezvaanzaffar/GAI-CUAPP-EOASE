import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminHeader from '@/components/admin/AdminHeader';
import { ConsolidatedAnalyticsDashboard } from '@/components/analytics/ConsolidatedAnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <div>
      <AdminHeader />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ConsolidatedAnalyticsDashboard />
      </div>
    </div>
  );
} 