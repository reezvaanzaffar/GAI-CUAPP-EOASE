import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all published content
    const content = await prisma.content.findMany({
      where: { isPublished: true },
    });

    // Fetch analytics for all content
    const analytics = await prisma.contentAnalytics.findMany({
      where: { contentId: { in: content.map(c => c.id) } },
    });

    // Calculate current period metrics
    const contentData = content.map(item => {
      const itemAnalytics = analytics.find(a => a.contentId === item.id);
      return {
        id: item.id,
        title: item.title,
        type: item.type,
        views: itemAnalytics?.views || 0,
        downloads: itemAnalytics?.uniqueViews || 0, // Using uniqueViews as downloads
        shares: 0, // No shares field in analytics
        averageTimeSpent: itemAnalytics?.averageTimeOnPage || 0,
      };
    });

    // Calculate total metrics
    const totalMetrics = contentData.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        downloads: acc.downloads + item.downloads,
        shares: acc.shares + item.shares,
        averageTimeSpent: acc.averageTimeSpent + item.averageTimeSpent,
      }),
      { views: 0, downloads: 0, shares: 0, averageTimeSpent: 0 }
    );

    // Calculate average time spent
    const averageTimeSpent = contentData.length
      ? totalMetrics.averageTimeSpent / contentData.length
      : 0;

    // Calculate trends by comparing with previous period
    const previousPeriod = new Date();
    previousPeriod.setMonth(previousPeriod.getMonth() - 1);

    const previousContent = await prisma.content.findMany({
      where: { 
        isPublished: true,
        createdAt: { lt: previousPeriod },
      },
    });

    const previousAnalytics = await prisma.contentAnalytics.findMany({
      where: { contentId: { in: previousContent.map(c => c.id) } },
    });

    const previousMetrics = previousContent.reduce(
      (acc, item) => {
        const itemAnalytics = previousAnalytics.find(a => a.contentId === item.id);
        return {
          views: acc.views + (itemAnalytics?.views || 0),
          downloads: acc.downloads + (itemAnalytics?.uniqueViews || 0),
          shares: acc.shares + 0, // No shares field
          averageTimeSpent: acc.averageTimeSpent + (itemAnalytics?.averageTimeOnPage || 0),
        };
      },
      { views: 0, downloads: 0, shares: 0, averageTimeSpent: 0 }
    );

    const trends = {
      views: previousMetrics.views ? ((totalMetrics.views - previousMetrics.views) / previousMetrics.views) * 100 : 0,
      downloads: previousMetrics.downloads ? ((totalMetrics.downloads - previousMetrics.downloads) / previousMetrics.downloads) * 100 : 0,
      shares: 0, // No shares data
      averageTimeSpent: previousMetrics.averageTimeSpent ? ((averageTimeSpent - (previousMetrics.averageTimeSpent / previousContent.length)) / (previousMetrics.averageTimeSpent / previousContent.length)) * 100 : 0,
    };

    // Generate chart data from actual content analytics
    const chartData = contentData.map(item => ({
      name: item.title,
      views: item.views,
      downloads: item.downloads,
      shares: item.shares,
    }));

    return NextResponse.json({
      metrics: {
        totalViews: totalMetrics.views,
        totalDownloads: totalMetrics.downloads,
        totalShares: totalMetrics.shares,
        averageTimeSpent,
      },
      trends,
      contentData,
      chartData,
    });
  } catch (error) {
    console.error('Content analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 