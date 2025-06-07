const { PrismaClient, UserPersona, MetricType, PpcKeywordStatus } = require('@prisma/client');

const prisma = new PrismaClient();
const DUMMY_PASSWORD_HASH = '$2b$10$abcdefghijklmnopqrstuv'; // bcrypt hash for 'password'

async function main() {
  // Create a Scaling Sarah user
  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Scaling Sarah',
      passwordHash: DUMMY_PASSWORD_HASH,
      profile: {
        create: {
          persona: 'SCALING_SARAH',
          headline: 'Amazon Seller | $50k Monthly Revenue',
          bio: 'Growing my Amazon business with a focus on operational excellence',
          isPublic: true,
          isSeekingInvestment: true,
          monthlyRevenue: 50000,
          teamSize: 5,
          personaData: {},
        },
      },
    },
  });

  // Generate 30 days of metrics
  const today = new Date();
  const metrics = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate random but realistic data
    const revenue = 800 + Math.random() * 400; // $800-$1200 daily
    const profit = revenue * (0.2 + Math.random() * 0.1); // 20-30% margin
    const ppcSpend = revenue * (0.1 + Math.random() * 0.05); // 10-15% of revenue
    const acos = (ppcSpend / revenue) * 100; // ACOS as percentage

    metrics.push(
      {
        userId: sarah.id,
        date,
        metricType: MetricType.REVENUE,
        value: revenue,
      },
      {
        userId: sarah.id,
        date,
        metricType: MetricType.PROFIT,
        value: profit,
      },
      {
        userId: sarah.id,
        date,
        metricType: MetricType.PPC_SPEND,
        value: ppcSpend,
      },
      {
        userId: sarah.id,
        date,
        metricType: MetricType.ACOS,
        value: acos,
      },
    );
  }

  // Create all metrics
  await prisma.businessMetric.createMany({
    data: metrics,
  });

  // Create PPC keywords for Sarah
  const sarahPpcKeywords = [
    // Good performing keywords
    {
      keywordText: 'organic protein powder',
      campaignName: 'Protein Supplements',
      adGroupName: 'Protein Powder',
      status: PpcKeywordStatus.ENABLED,
      spend: 150.0,
      sales: 1200.0,
      impressions: 5000,
    },
    {
      keywordText: 'vegan protein shake',
      campaignName: 'Protein Supplements',
      adGroupName: 'Protein Powder',
      status: PpcKeywordStatus.ENABLED,
      spend: 200.0,
      sales: 1800.0,
      impressions: 6000,
    },
    // Underperforming keywords
    {
      keywordText: 'protein powder bulk',
      campaignName: 'Protein Supplements',
      adGroupName: 'Bulk Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 300.0,
      sales: 0.0,
      impressions: 2000,
    },
    {
      keywordText: 'cheap protein powder',
      campaignName: 'Protein Supplements',
      adGroupName: 'Budget Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 250.0,
      sales: 100.0,
      impressions: 4000,
    },
    // Zombie keywords
    {
      keywordText: 'protein powder wholesale',
      campaignName: 'Protein Supplements',
      adGroupName: 'Bulk Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 50.0,
      sales: 0.0,
      impressions: 100,
    },
    {
      keywordText: 'protein powder distributor',
      campaignName: 'Protein Supplements',
      adGroupName: 'Bulk Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 75.0,
      sales: 0.0,
      impressions: 150,
    },
    // More good performing keywords
    {
      keywordText: 'whey protein isolate',
      campaignName: 'Protein Supplements',
      adGroupName: 'Whey Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 180.0,
      sales: 1500.0,
      impressions: 4500,
    },
    {
      keywordText: 'casein protein powder',
      campaignName: 'Protein Supplements',
      adGroupName: 'Casein Products',
      status: PpcKeywordStatus.ENABLED,
      spend: 120.0,
      sales: 900.0,
      impressions: 3000,
    },
    // More underperforming keywords
    {
      keywordText: 'protein powder samples',
      campaignName: 'Protein Supplements',
      adGroupName: 'Samples',
      status: PpcKeywordStatus.ENABLED,
      spend: 400.0,
      sales: 50.0,
      impressions: 8000,
    },
    {
      keywordText: 'free protein powder',
      campaignName: 'Protein Supplements',
      adGroupName: 'Samples',
      status: PpcKeywordStatus.ENABLED,
      spend: 350.0,
      sales: 0.0,
      impressions: 7000,
    },
  ];

  // Create PPC keywords for Sarah
  await Promise.all(
    sarahPpcKeywords.map(keyword =>
      prisma.ppcKeyword.create({
        data: {
          ...keyword,
          userId: sarah.id,
        },
      }),
    ),
  );

  // Create Module 1 for Startup Sam
  const module1 = await prisma.learningModule.create({
    data: {
      title: 'Module 1: Product Discovery & Validation',
      description:
        'Learn the fundamentals of product research and validation for your Amazon business.',
      persona: UserPersona.STARTUP_SAM,
      order: 1,
      steps: {
        create: [
          {
            title: 'Step 1: Understanding Your Niche',
            content: `# Understanding Your Niche

## Key Concepts
- Market size and growth potential
- Target audience identification
- Problem-solution fit
- Competitive landscape

## Action Items
1. Research market size using Jungle Scout
2. Identify top 3 competitors
3. Document customer pain points
4. Validate problem-solution fit

## Resources
- Jungle Scout Market Research Guide
- Amazon Best Sellers List
- Google Trends Analysis`,
            order: 1,
          },
          {
            title: 'Step 2: Competitor Analysis',
            content: `# Competitor Analysis

## Key Concepts
- Direct vs indirect competitors
- Product differentiation
- Pricing strategies
- Marketing approaches

## Action Items
1. Create competitor matrix
2. Analyze product listings
3. Review customer feedback
4. Identify market gaps

## Resources
- Competitor Analysis Template
- Amazon Review Analysis Tool
- Pricing Strategy Guide`,
            order: 2,
          },
          {
            title: 'Step 3: The Risk Assessment Checklist',
            content: `# Risk Assessment Checklist

## Key Concepts
- Market risks
- Operational risks
- Financial risks
- Mitigation strategies

## Action Items
1. Complete risk assessment matrix
2. Calculate initial investment needs
3. Identify potential roadblocks
4. Create contingency plans

## Resources
- Risk Assessment Template
- Investment Calculator
- Contingency Planning Guide`,
            order: 3,
          },
        ],
      },
    },
  });

  console.log('Created sample data for Sarah and Sam');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
