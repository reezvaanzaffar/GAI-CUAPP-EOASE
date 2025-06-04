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
