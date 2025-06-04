import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Dashboard endpoint - Session retrieved by getServerSession:', session);

    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('Dashboard endpoint - Unauthorized access attempt:', session);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch performance metrics from PerformanceMetric table
    const performanceMetrics = await prisma.performanceMetric.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    const getMetric = (type: string) => {
      const metric = performanceMetrics.find(m => m.type === type);
      return metric ? metric.value : 0;
    };

    // Fetch analytics data
    const [visitors, orders, userEvents] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.userEvent.findMany({
        where: { type: 'PAGE_VIEW' },
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    // Calculate page views
    const pageViews = userEvents.length;

    // Calculate sessions (by userId + session window, fallback to userId)
    // If you have session IDs, use them. Otherwise, group by userId and time window (e.g., 30 min inactivity)
    const sessions: Record<string, Date[]> = {};
    userEvents.forEach(event => {
      const userId = event.userId || 'anonymous';
      if (!sessions[userId]) sessions[userId] = [];
      sessions[userId].push(event.timestamp);
    });

    // For each user, sort timestamps and split into sessions (30 min inactivity)
    let sessionCount = 0;
    let singlePageSessions = 0;
    let totalSessionDuration = 0;
    Object.values(sessions).forEach(timestamps => {
      timestamps.sort((a, b) => a.getTime() - b.getTime());
      let sessionStart = timestamps[0];
      let lastEvent = timestamps[0];
      let pageCount = 1;
      for (let i = 1; i < timestamps.length; i++) {
        const diff = (timestamps[i].getTime() - lastEvent.getTime()) / 1000;
        if (diff > 1800) { // 30 min inactivity
          sessionCount++;
          if (pageCount === 1) singlePageSessions++;
          totalSessionDuration += (lastEvent.getTime() - sessionStart.getTime());
          sessionStart = timestamps[i];
          pageCount = 1;
        } else {
          pageCount++;
        }
        lastEvent = timestamps[i];
      }
      // Last session for this user
      sessionCount++;
      if (pageCount === 1) singlePageSessions++;
      totalSessionDuration += (lastEvent.getTime() - sessionStart.getTime());
    });

    // Calculate bounce rate and average session duration
    const bounceRate = sessionCount > 0 ? (singlePageSessions / sessionCount) * 100 : 0;
    const averageSessionDuration = sessionCount > 0 ? totalSessionDuration / sessionCount / 1000 : 0; // in seconds

    // Calculate conversion rate
    const conversionRate = visitors > 0 ? (orders / visitors) * 100 : 0;

    const dashboardData = {
      performance: {
        pageLoad: getMetric('load_time'),
        timeToInteractive: getMetric('interaction_time'),
        firstContentfulPaint: getMetric('first_contentful_paint'),
        cumulativeLayoutShift: getMetric('cumulative_layout_shift'),
      },
      analytics: {
        visitors,
        pageViews,
        bounceRate,
        averageSessionDuration,
        conversionRate,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}