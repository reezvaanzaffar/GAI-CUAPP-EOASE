import { PrismaClient, AutomationPlatform } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create test alerts
  const alerts = await Promise.all([
    prisma.automationAlert.create({
      data: {
        type: 'PERFORMANCE',
        message: 'High server response time detected (2.5s)',
        platform: AutomationPlatform.CUSTOM,
        status: 'ACTIVE',
        timestamp: new Date(),
      },
    }),
    prisma.automationAlert.create({
      data: {
        type: 'CONVERSION',
        message: 'Cart abandonment rate increased by 15%',
        platform: AutomationPlatform.CUSTOM,
        status: 'ACTIVE',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.automationAlert.create({
      data: {
        type: 'INTEGRATION',
        message: 'Payment gateway integration experiencing delays',
        platform: AutomationPlatform.CUSTOM,
        status: 'RESOLVED',
        resolution: 'Fixed by updating API endpoint',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
  ]);

  // Create test recommendations
  const recommendations = await Promise.all([
    prisma.optimizationRecommendation.create({
      data: {
        type: 'PERFORMANCE',
        title: 'Optimize Product Images',
        description: 'Compress product images to improve page load time',
        impact: 'high',
        effort: 'medium',
        priority: 1,
      },
    }),
    prisma.optimizationRecommendation.create({
      data: {
        type: 'CONVERSION',
        title: 'Implement Cart Abandonment Recovery',
        description: 'Set up automated email reminders for abandoned carts',
        impact: 'high',
        effort: 'low',
        priority: 2,
      },
    }),
    prisma.optimizationRecommendation.create({
      data: {
        type: 'CONTENT',
        title: 'Enhance Product Descriptions',
        description: 'Add more detailed specifications and benefits to product descriptions',
        impact: 'medium',
        effort: 'medium',
        priority: 3,
      },
    }),
  ]);

  console.log('Test alerts and recommendations seeded!');
  console.log('Created alerts:', alerts.length);
  console.log('Created recommendations:', recommendations.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 