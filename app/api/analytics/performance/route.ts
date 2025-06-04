import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all performance metrics
    const metrics = await prisma.performanceMetric.findMany({
      orderBy: { timestamp: 'desc' },
    });

    // Group metrics by type
    const metricsByType = metrics.reduce((acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric);
      return acc;
    }, {} as Record<string, typeof metrics>);

    // Calculate current period metrics
    const performanceData = Object.entries(metricsByType).map(([type, typeMetrics]) => {
      const latestMetric = typeMetrics[0];
      return {
        id: type,
        name: type,
        value: latestMetric.value,
        unit: getUnitForMetricType(type),
        trend: calculateTrend(typeMetrics),
      };
    });

    // Calculate total metrics
    const totalMetrics = performanceData.reduce(
      (acc, item) => ({
        loadTime: acc.loadTime + (item.name === 'load_time' ? item.value : 0),
        interactionTime: acc.interactionTime + (item.name === 'interaction_time' ? item.value : 0),
        apiResponseTime: acc.apiResponseTime + (item.name === 'api_response_time' ? item.value : 0),
        resourceLoadTime: acc.resourceLoadTime + (item.name === 'resource_load_time' ? item.value : 0),
      }),
      { loadTime: 0, interactionTime: 0, apiResponseTime: 0, resourceLoadTime: 0 }
    );

    // Calculate averages
    const averageMetrics = {
      loadTime: totalMetrics.loadTime / (performanceData.filter(item => item.name === 'load_time').length || 1),
      interactionTime: totalMetrics.interactionTime / (performanceData.filter(item => item.name === 'interaction_time').length || 1),
      apiResponseTime: totalMetrics.apiResponseTime / (performanceData.filter(item => item.name === 'api_response_time').length || 1),
      resourceLoadTime: totalMetrics.resourceLoadTime / (performanceData.filter(item => item.name === 'resource_load_time').length || 1),
    };

    // Calculate trends by comparing with previous period
    const previousPeriod = new Date();
    previousPeriod.setMonth(previousPeriod.getMonth() - 1);

    const previousMetrics = await prisma.performanceMetric.findMany({
      where: { timestamp: { lt: previousPeriod } },
      orderBy: { timestamp: 'desc' },
    });

    const previousMetricsByType = previousMetrics.reduce((acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric);
      return acc;
    }, {} as Record<string, typeof previousMetrics>);

    const previousAverages = Object.entries(previousMetricsByType).reduce(
      (acc, [type, typeMetrics]) => {
        const avg = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length;
        return {
          ...acc,
          [type]: avg,
        };
      },
      {} as Record<string, number>
    );

    const trends = {
      loadTime: calculateTrendPercentage(averageMetrics.loadTime, previousAverages['load_time'] || 0),
      interactionTime: calculateTrendPercentage(averageMetrics.interactionTime, previousAverages['interaction_time'] || 0),
      apiResponseTime: calculateTrendPercentage(averageMetrics.apiResponseTime, previousAverages['api_response_time'] || 0),
      resourceLoadTime: calculateTrendPercentage(averageMetrics.resourceLoadTime, previousAverages['resource_load_time'] || 0),
    };

    // Generate chart data from actual metrics
    const chartData = Object.entries(metricsByType).map(([type, typeMetrics]) => ({
      name: type,
      value: typeMetrics[0].value,
    }));

    return NextResponse.json({
      metrics: averageMetrics,
      trends,
      performanceData,
      chartData,
    });
  } catch (error) {
    console.error('Performance analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getUnitForMetricType(type: string): string {
  switch (type) {
    case 'load_time':
    case 'interaction_time':
    case 'api_response_time':
    case 'resource_load_time':
      return 'ms';
    default:
      return '';
  }
}

function calculateTrend(metrics: { value: number; timestamp: Date }[]): number {
  if (metrics.length < 2) return 0;
  
  const sortedMetrics = [...metrics].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstValue = sortedMetrics[0].value;
  const lastValue = sortedMetrics[sortedMetrics.length - 1].value;
  
  return firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;
}

function calculateTrendPercentage(current: number, previous: number): number {
  return previous ? ((current - previous) / previous) * 100 : 0;
} 