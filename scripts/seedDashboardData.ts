import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: 'testpassword',
      emailVerified: true,
    },
  });

  // Create a workflow
  const workflow = await prisma.automationWorkflow.create({
    data: {
      name: 'Test Workflow',
      platform: 'ZAPIER',
      type: 'WORKFLOW',
      status: 'ACTIVE',
      trigger: {},
    },
  });

  // Create automation metrics
  await prisma.automationMetrics.create({
    data: {
      successRate: 0.95,
      averageProcessingTime: 1.5,
      totalExecutions: 100,
      lastExecution: new Date(),
      workflow: { connect: { id: workflow.id } },
    },
  });

  // Create an automation log
  await prisma.automationLog.create({
    data: {
      workflow: { connect: { id: workflow.id } },
      platform: 'ZAPIER',
      event: 'Test Event',
      status: 'COMPLETED',
      details: {},
    },
  });

  // Create or update a product
  const product = await prisma.product.upsert({
    where: { sku: 'TESTSKU' },
    update: {},
    create: {
      name: 'Test Product',
      description: 'A test product',
      price: 19.99,
      sku: 'TESTSKU',
      stock: 10,
      category: 'Test Category',
      images: [],
      user: { connect: { id: user.id } },
    },
  });

  // Create an order
  await prisma.order.create({
    data: {
      user: { connect: { id: user.id } },
      items: {
        create: [{
          product: { connect: { id: product.id } },
          quantity: 1,
          price: 19.99,
        }],
      },
      status: 'DELIVERED',
      total: 19.99,
      shippingAddress: {},
      paymentMethod: 'card',
      paymentStatus: 'PAID',
    },
  });

  // Create a sales user for Google login
  const salesUser = await prisma.user.upsert({
    where: { email: 'reezvaan@gmail.com' },
    update: {},
    create: {
      email: 'reezvaan@gmail.com',
      name: 'Reezvaan',
      role: 'sales',
      emailVerified: true,
    },
  });

  // Seed diverse leads for sales dashboard
  const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
  const leadSources = ['Website', 'Referral', 'Ad', 'Event'];
  const priorities = ['HIGH', 'MEDIUM', 'LOW'];
  const leads = [];
  for (let i = 0; i < 20; i++) {
    const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
    const source = leadSources[Math.floor(Math.random() * leadSources.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const expectedValue = Math.floor(Math.random() * 90000) + 10000;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
    const expectedCloseDate = new Date(createdAt.getTime() + Math.floor(Math.random() * 30 + 10) * 24 * 60 * 60 * 1000);
    const userId = i % 2 === 0 ? salesUser.id : user.id;
    const lead = await prisma.lead.create({
      data: {
        name: `Lead ${i + 1}`,
        companyName: `Company ${i + 1}`,
        contactName: `Contact ${i + 1}`,
        contactEmail: `contact${i + 1}@example.com`,
        contactPhone: `555-000${i + 1}`,
        status,
        priority,
        expectedValue,
        expectedCloseDate,
        userId,
        source,
        createdAt,
        updatedAt: createdAt,
      },
    });
    leads.push(lead);
    // Seed multiple communications, notes, and tasks for every lead
    for (let j = 0; j < 3; j++) {
      await prisma.leadCommunication.create({
        data: {
          leadId: lead.id,
          type: ['call', 'email', 'meeting'][j % 3],
          content: `Sample ${['call', 'email', 'meeting'][j % 3]} communication for lead ${i + 1}`,
          createdAt: new Date(createdAt.getTime() + j * 60 * 60 * 1000),
        },
      });
      await prisma.leadNote.create({
        data: {
          leadId: lead.id,
          content: `Note ${j + 1} for lead ${i + 1}`,
          createdAt: new Date(createdAt.getTime() + j * 2 * 60 * 60 * 1000),
        },
      });
      await prisma.leadTask.create({
        data: {
          leadId: lead.id,
          title: `Task ${j + 1} for lead ${i + 1}`,
          description: `Task description ${j + 1} for lead ${i + 1}`,
          dueDate: new Date(createdAt.getTime() + (j + 1) * 24 * 60 * 60 * 1000),
        },
      });
    }
    for (let j = 0; j < 2; j++) {
      await prisma.leadDocument.create({
        data: {
          leadId: lead.id,
          name: `Document ${j + 1} for lead ${i + 1}`,
          type: j % 2 === 0 ? 'PDF' : 'DOCX',
          url: `https://example.com/docs/lead${i + 1}_doc${j + 1}.${j % 2 === 0 ? 'pdf' : 'docx'}`,
        },
      });
    }
  }

  // Print out seeded data for verification
  const metrics = await prisma.automationMetrics.findMany({ include: { workflow: true } });
  const users = await prisma.user.findMany();
  const logs = await prisma.automationLog.findMany();
  const orders = await prisma.order.findMany();
  console.log('Seed complete. Metrics:', metrics);
  console.log('Users:', users);
  console.log('Logs:', logs);
  console.log('Orders:', orders);
}

main().catch(console.error).finally(() => prisma.$disconnect());
