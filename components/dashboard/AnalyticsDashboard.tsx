import React, { useEffect, useState } from 'react';
import { BarChartIcon, UsersIcon, ShoppingCartIcon, TrendingUpIcon } from '../icons';
import { formatMetricValue } from '@/lib/utils/dashboard';

const AnalyticsDashboard: React.FC = () => {
  const [apiData, setApiData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(data => {
        console.log('Dashboard API data:', data);
        setApiData(data);
        setApiLoading(false);
      })
      .catch(err => {
        setApiError(err.message);
        setApiLoading(false);
      });
  }, []);

  if (apiLoading) {
    console.log('Dashboard: Loading API data...');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (apiError) {
    console.error('Dashboard: API error:', apiError);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">API Error: {apiError}</div>
      </div>
    );
  }
  if (apiData && apiData.performance && apiData.analytics) {
    console.log('Dashboard: Rendering with API data.');
    const { performance, analytics, lastUpdated } = apiData;
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'N/A'}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visitors */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <UsersIcon className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-gray-500">Visitors</div>
            <div className="text-2xl font-bold">{formatMetricValue(analytics.visitors, 'number')}</div>
          </div>
          {/* Page Views */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <BarChartIcon className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-gray-500">Page Views</div>
            <div className="text-2xl font-bold">{formatMetricValue(analytics.pageViews, 'number')}</div>
          </div>
          {/* Bounce Rate */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <TrendingUpIcon className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-gray-500">Bounce Rate</div>
            <div className="text-2xl font-bold">{formatMetricValue(analytics.bounceRate / 100, 'percentage')}</div>
          </div>
          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <ShoppingCartIcon className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-2xl font-bold">{formatMetricValue(analytics.conversionRate / 100, 'percentage')}</div>
          </div>
        </div>
        <div className="mt-6">
          <pre className="bg-gray-100 text-gray-800 p-4 rounded mb-4 overflow-x-auto">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
  console.warn('Dashboard: No data available from API.');
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-gray-500">No data available</div>
    </div>
  );
};

export default AnalyticsDashboard;