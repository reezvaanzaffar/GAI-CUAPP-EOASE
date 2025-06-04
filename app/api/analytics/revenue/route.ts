import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all orders
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate current period metrics
    const revenueData = orders.map(order => ({
      id: order.id,
      date: order.createdAt,
      amount: order.total,
      status: order.status,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        category: item.product.category,
      })),
    }));

    // Calculate total metrics
    const totalRevenue = revenueData.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = revenueData.length;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    // Calculate trends by comparing with previous period
    const previousPeriod = new Date();
    previousPeriod.setMonth(previousPeriod.getMonth() - 1);

    const previousOrders = await prisma.order.findMany({
      where: { createdAt: { lt: previousPeriod } },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const previousOrderCount = previousOrders.length;
    const previousAverageOrderValue = previousOrderCount ? previousRevenue / previousOrderCount : 0;

    const trends = {
      revenue: previousRevenue ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0,
      orders: previousOrderCount ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0,
      averageOrderValue: previousAverageOrderValue ? ((averageOrderValue - previousAverageOrderValue) / previousAverageOrderValue) * 100 : 0,
    };

    // Generate chart data from actual orders
    const chartData = revenueData.map(order => ({
      date: order.date.toISOString().split('T')[0],
      revenue: order.amount,
      orders: 1,
    }));

    // Generate pie chart data by product category
    const categoryRevenue = revenueData.reduce((acc, order) => {
      order.items.forEach(item => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += item.price * item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      name: category,
      value: revenue,
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
      },
      trends,
      revenueData,
      chartData,
      pieData,
    });
  } catch (error) {
    console.error('Revenue analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 