import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { DataTable } from '@/components/ui/DataTable';
import Link from 'next/link';
import Image from 'next/image';

interface OpportunityUser extends User {
  profile: Profile;
  metrics: {
    revenue: number;
    profit: number;
  };
}

interface InvestorDashboardProps {
  opportunities: OpportunityUser[];
}

export default function InvestorDashboard({ opportunities }: InvestorDashboardProps) {
  const columns = [
    {
      header: 'Business',
      accessor: (user: OpportunityUser) => (
        <Link
          href={`/users/${user.id}`}
          className="flex items-center space-x-3 text-indigo-600 hover:text-indigo-900"
        >
          {user.image ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={user.image}
                alt={user.name || 'Profile picture'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span>{user.name}</span>
        </Link>
      ),
    },
    {
      header: 'Headline',
      accessor: (user: OpportunityUser) => user.profile.headline || '-',
    },
    {
      header: 'Revenue (90d)',
      accessor: (user: OpportunityUser) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(user.metrics.revenue),
    },
    {
      header: 'Profit (90d)',
      accessor: (user: OpportunityUser) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(user.metrics.profit),
    },
    {
      header: 'Profit Margin',
      accessor: (user: OpportunityUser) => {
        const margin =
          user.metrics.revenue > 0 ? (user.metrics.profit / user.metrics.revenue) * 100 : 0;
        return `${margin.toFixed(1)}%`;
      },
    },
  ];

  return (
    <PersonaDashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Investment Opportunities</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover businesses seeking investment and track their performance
          </p>
        </div>

        <DataTable
          data={opportunities}
          columns={columns}
          emptyMessage="No investment opportunities available at this time"
        />
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

  // Verify user is an investor
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user || user.profile?.persona !== 'INVESTOR_IAN') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  // Get all Scaling Sarah users who are seeking investment and have public profiles
  const opportunityUsers = await prisma.user.findMany({
    where: {
      profile: {
        persona: 'SCALING_SARAH',
        isSeekingInvestment: true,
        isPublic: true,
      },
    },
    include: {
      profile: true,
    },
  });

  // Calculate metrics for each user
  const opportunities = await Promise.all(
    opportunityUsers.map(async user => {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const metrics = await prisma.businessMetric.groupBy({
        by: ['metricType'],
        where: {
          userId: user.id,
          date: {
            gte: ninetyDaysAgo,
          },
        },
        _sum: {
          value: true,
        },
      });

      const revenue = metrics.find(m => m.metricType === 'REVENUE')?._sum.value || 0;
      const profit = metrics.find(m => m.metricType === 'PROFIT')?._sum.value || 0;

      return {
        ...user,
        metrics: {
          revenue,
          profit,
        },
      };
    }),
  );

  return {
    props: {
      opportunities: JSON.parse(JSON.stringify(opportunities)),
    },
  };
};
