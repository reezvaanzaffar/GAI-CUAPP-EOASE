import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create test content
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        title: 'Getting Started Guide',
        type: 'article',
        slug: 'getting-started',
        description: 'Learn how to get started with our platform',
        isPublished: true,
        tags: ['guide', 'beginner'],
        engagementScore: 0.85,
      },
    }),
    prisma.content.create({
      data: {
        title: 'Advanced Features',
        type: 'article',
        slug: 'advanced-features',
        description: 'Explore advanced platform features',
        isPublished: true,
        tags: ['advanced', 'features'],
        engagementScore: 0.75,
      },
    }),
  ]);

  // Create user events
  const userEvents = await Promise.all([
    prisma.userEvent.create({
      data: {
        type: 'page_view',
        userId: '1', // Using the admin user ID
        metadata: {
          path: '/dashboard',
          referrer: 'google.com',
          userAgent: 'Mozilla/5.0',
        },
      },
    }),
    prisma.userEvent.create({
      data: {
        type: 'search',
        userId: '1',
        metadata: {
          query: 'analytics dashboard',
          results: 12,
        },
      },
    }),
  ]);

  // Create user interactions
  const userInteractions = await Promise.all([
    prisma.userInteraction.create({
      data: {
        type: 'click',
        userId: '1',
        contentId: contents[0].id,
        metadata: {
          element: 'button',
          text: 'Read More',
        },
      },
    }),
    prisma.userInteraction.create({
      data: {
        type: 'scroll',
        userId: '1',
        contentId: contents[1].id,
        metadata: {
          depth: 0.75,
          duration: 120,
        },
      },
    }),
  ]);

  // Create performance metrics
  const performanceMetrics = await Promise.all([
    prisma.performanceMetric.create({
      data: {
        type: 'page_load',
        value: 1200,
        metadata: {
          page: '/dashboard',
          browser: 'Chrome',
        },
      },
    }),
    prisma.performanceMetric.create({
      data: {
        type: 'api_response',
        value: 350,
        metadata: {
          endpoint: '/api/analytics',
          method: 'GET',
        },
      },
    }),
  ]);

  // Create content analytics
  const contentAnalytics = await Promise.all(
    contents.map((content) =>
      prisma.contentAnalytics.create({
        data: {
          contentId: content.id,
          views: Math.floor(Math.random() * 1000),
          uniqueViews: Math.floor(Math.random() * 800),
          averageTimeOnPage: Math.random() * 300,
          bounceRate: Math.random() * 50,
          conversionRate: Math.random() * 10,
        },
      })
    )
  );

  // Create alerts
  const alerts = await Promise.all([
    prisma.alert.create({
      data: {
        type: 'performance',
        message: 'High page load time detected',
        severity: 'medium',
      },
    }),
    prisma.alert.create({
      data: {
        type: 'engagement',
        message: 'Low user engagement on homepage',
        severity: 'low',
      },
    }),
  ]);

  // Create optimization recommendations
  const recommendations = await Promise.all([
    prisma.optimizationRecommendation.create({
      data: {
        type: 'performance',
        title: 'Optimize Image Loading',
        description: 'Implement lazy loading for images to improve page load time',
        impact: 'high',
        effort: 'medium',
        priority: 1,
      },
    }),
    prisma.optimizationRecommendation.create({
      data: {
        type: 'engagement',
        title: 'Add Call-to-Action',
        description: 'Add prominent CTAs to increase user engagement',
        impact: 'medium',
        effort: 'low',
        priority: 2,
      },
    }),
  ]);

  console.log('Analytics seed complete!');
  console.log('Created:', {
    contents: contents.length,
    userEvents: userEvents.length,
    userInteractions: userInteractions.length,
    performanceMetrics: performanceMetrics.length,
    contentAnalytics: contentAnalytics.length,
    alerts: alerts.length,
    recommendations: recommendations.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 