import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a user first
  const user = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Buyer User',
      role: 'USER',
      password: 'testpassword',
      emailVerified: true,
    },
  });

  // Create some products owned by the user
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'SKU1' },
      update: {},
      create: {
        name: 'Wireless Headphones',
        description: 'Bluetooth over-ear headphones',
        price: 120,
        sku: 'SKU1',
        stock: 50,
        category: 'Electronics',
        images: [],
        user: { connect: { id: user.id } },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SKU2' },
      update: {},
      create: {
        name: 'Yoga Pants',
        description: 'Comfortable stretch pants',
        price: 40,
        sku: 'SKU2',
        stock: 100,
        category: 'Clothing',
        images: [],
        user: { connect: { id: user.id } },
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SKU3' },
      update: {},
      create: {
        name: 'Garden Tools Set',
        description: '5-piece gardening kit',
        price: 60,
        sku: 'SKU3',
        stock: 30,
        category: 'Home & Garden',
        images: [],
        user: { connect: { id: user.id } },
      },
    }),
  ]);

  // Create orders
  const now = new Date();
  await Promise.all([
    prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        items: {
          create: [{ product: { connect: { id: products[0].id } }, quantity: 2, price: 120 }],
        },
        status: 'DELIVERED',
        total: 240,
        shippingAddress: {},
        paymentMethod: 'card',
        paymentStatus: 'PAID',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 10),
      },
    }),
    prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        items: {
          create: [{ product: { connect: { id: products[1].id } }, quantity: 3, price: 40 }],
        },
        status: 'DELIVERED',
        total: 120,
        shippingAddress: {},
        paymentMethod: 'paypal',
        paymentStatus: 'PAID',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      },
    }),
    prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        items: {
          create: [{ product: { connect: { id: products[2].id } }, quantity: 1, price: 60 }],
        },
        status: 'DELIVERED',
        total: 60,
        shippingAddress: {},
        paymentMethod: 'card',
        paymentStatus: 'PAID',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
      },
    }),
  ]);

  console.log('Test orders seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 