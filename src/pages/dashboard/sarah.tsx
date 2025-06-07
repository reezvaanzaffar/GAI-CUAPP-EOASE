import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { MetricCard } from '@/components/dashboard/widgets/MetricCard';
import { MetricChart } from '@/components/dashboard/widgets/MetricChart';
import Link from 'next/link';

interface DashboardProps {
  metrics: {
    revenue: {
      total: number;
      change: number;
      data: { date: string; value: number }[];
    };
    profit: {
      total: number;
      change: number;
      data: { date: string; value: number }[];
    };
    ppcSpend: {
      total: number;
      change: number;
      data: { date: string; value: number }[];
    };
    acos: {
      total: number;
      change: number;
      data: { date: string; value: number }[];
    };
  };
}

export default function SarahDashboard({ metrics }: DashboardProps) {
  return (
    <PersonaDashboardLayout persona="Scaling Sarah">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Business Health Dashboard</h2>
          <p className="text-muted-foreground">Monitor your business performance and growth</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue (Last 30 Days)"
            value={metrics.revenue.total}
            prefix="$"
            change={metrics.revenue.change}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Total Profit (Last 30 Days)"
            value={metrics.profit.total}
            prefix="$"
            change={metrics.profit.change}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Total PPC Spend (Last 30 Days)"
            value={metrics.ppcSpend.total}
            prefix="$"
            change={metrics.ppcSpend.change}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Average ACOS (Last 30 Days)"
            value={metrics.acos.total}
            suffix="%"
            change={metrics.acos.change}
            changeLabel="vs last period"
            as={Link}
            href="/dashboard/ppc-optimizer"
            className="cursor-pointer hover:bg-gray-50 transition-colors"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MetricChart title="Revenue Over Time" data={metrics.revenue.data} prefix="$" />
          <MetricChart title="Profit Over Time" data={metrics.profit.data} prefix="$" />
        </div>
      </div>
    </PersonaDashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Get date range for last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Fetch metrics for the last 30 days
  const metrics = await prisma.businessMetric.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Process metrics data
  const processMetrics = (type: MetricType) => {
    const typeMetrics = metrics.filter(m => m.metricType === type);
    const total = typeMetrics.reduce((sum, m) => sum + m.value, 0);

    // Calculate change from previous period
    const previousPeriod = typeMetrics.slice(0, 15).reduce((sum, m) => sum + m.value, 0);
    const currentPeriod = typeMetrics.slice(15).reduce((sum, m) => sum + m.value, 0);
    const change = previousPeriod ? ((currentPeriod - previousPeriod) / previousPeriod) * 100 : 0;

    // Format data for charts
    const data = typeMetrics.map(m => ({
      date: m.date.toISOString(),
      value: m.value,
    }));

    return { total, change, data };
  };

  return {
    props: {
      metrics: {
        revenue: processMetrics(MetricType.REVENUE),
        profit: processMetrics(MetricType.PROFIT),
        ppcSpend: processMetrics(MetricType.PPC_SPEND),
        acos: processMetrics(MetricType.ACOS),
      },
    },
  };
};
