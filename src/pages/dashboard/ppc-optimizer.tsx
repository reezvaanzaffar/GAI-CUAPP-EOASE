import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { DataTable } from '@/components/ui/DataTable';
import { PpcKeyword } from '@prisma/client';

interface PpcKeywordWithMetrics extends PpcKeyword {
  acos: number | null;
  suggestedAction: string;
}

interface PpcOptimizerProps {
  keywords: PpcKeywordWithMetrics[];
}

export default function PpcOptimizer({ keywords }: PpcOptimizerProps) {
  const columns = [
    {
      accessor: 'keywordText',
      Header: 'Keyword',
    },
    {
      accessor: 'campaignName',
      Header: 'Campaign',
    },
    {
      accessor: 'adGroupName',
      Header: 'Ad Group',
    },
    {
      accessor: 'status',
      Header: 'Status',
      Cell: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'ENABLED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      accessor: 'spend',
      Header: 'Spend',
      Cell: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      accessor: 'sales',
      Header: 'Sales',
      Cell: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      accessor: 'impressions',
      Header: 'Impressions',
      Cell: (value: number) => value.toLocaleString(),
    },
    {
      accessor: 'acos',
      Header: 'ACOS',
      Cell: (value: number | null) => (value !== null ? `${value.toFixed(1)}%` : 'N/A'),
    },
    {
      accessor: 'suggestedAction',
      Header: 'Suggested Action',
      Cell: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'Optimize'
              ? 'bg-yellow-100 text-yellow-800'
              : value === 'Pause?'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <PersonaDashboardLayout persona="Scaling Sarah">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">PPC Keyword Optimizer</h2>
          <p className="text-muted-foreground">
            Analyze and optimize your PPC keywords for better performance
          </p>
        </div>

        <DataTable columns={columns} data={keywords} />
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

  const keywords = await prisma.ppcKeyword.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      spend: 'desc',
    },
  });

  // Calculate ACOS and suggested actions
  const keywordsWithMetrics: PpcKeywordWithMetrics[] = keywords.map(keyword => {
    const acos = keyword.sales > 0 ? (keyword.spend / keyword.sales) * 100 : null;
    let suggestedAction = 'Monitor';

    if (acos !== null && acos > 60) {
      suggestedAction = 'Optimize';
    } else if (keyword.spend > 50 && keyword.sales === 0) {
      suggestedAction = 'Pause?';
    }

    return {
      ...keyword,
      acos,
      suggestedAction,
    };
  });

  return {
    props: {
      keywords: keywordsWithMetrics,
    },
  };
};
