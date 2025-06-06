const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: { name: 'Alice', email: 'alice@example.com', password: 'password', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: { name: 'Bob', email: 'bob@example.com', password: 'password', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: { name: 'Charlie', email: 'charlie@example.com', password: 'password', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'outsetecom@gmail.com' },
      update: {},
      create: { id: '113112938783430216686', name: 'Ecommerce Outset', email: 'outsetecom@gmail.com', password: 'password', role: 'USER' },
    }),
  ]);

  // Seed orders
  const orders = await Promise.all([
    prisma.order.create({ data: { userId: users[0].id, total: 120.5, status: 'DELIVERED', shippingAddress: {}, paymentMethod: 'card', paymentStatus: 'PAID' } }),
    prisma.order.create({ data: { userId: users[1].id, total: 75.0, status: 'DELIVERED', shippingAddress: {}, paymentMethod: 'paypal', paymentStatus: 'PAID' } }),
    prisma.order.create({ data: { userId: '113112938783430216686', total: 200.0, status: 'DELIVERED', shippingAddress: {}, paymentMethod: 'card', paymentStatus: 'PAID' } }),
  ]);

  // Seed user events (PAGE_VIEW)
  const now = new Date();
  const events = [];
  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length];
    const userId = user.email === 'outsetecom@gmail.com' ? '113112938783430216686' : user.id;
    events.push(
      prisma.userEvent.create({
        data: {
          type: 'PAGE_VIEW',
          userId,
          timestamp: new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)),
          metadata: { page: '/dashboard' },
        },
      })
    );
  }
  await Promise.all(events);

  // Seed performance metrics
  await Promise.all([
    prisma.performanceMetric.create({
      data: {
        type: 'load_time',
        value: 1200,
        timestamp: new Date(),
        metadata: { page: '/dashboard' },
      },
    }),
    prisma.performanceMetric.create({
      data: {
        type: 'interaction_time',
        value: 800,
        timestamp: new Date(),
        metadata: { page: '/dashboard' },
      },
    }),
    prisma.performanceMetric.create({
      data: {
        type: 'first_contentful_paint',
        value: 600,
        timestamp: new Date(),
        metadata: { page: '/dashboard' },
      },
    }),
    prisma.performanceMetric.create({
      data: {
        type: 'cumulative_layout_shift',
        value: 0.05,
        timestamp: new Date(),
        metadata: { page: '/dashboard' },
      },
    }),
  ]);

  console.log('Seeded dashboard analytics data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 