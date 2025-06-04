import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Define funnel steps
    const funnelSteps = [
      { id: '1', name: 'View Product' },
      { id: '2', name: 'Add to Cart' },
      { id: '3', name: 'Checkout' },
      { id: '4', name: 'Complete Purchase' },
    ];

    // Fetch user interactions for each step
    const interactions = await prisma.userInteraction.findMany({
      where: {
        type: { in: ['view_product', 'add_to_cart', 'start_checkout', 'complete_purchase'] },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Fetch orders for conversion data
    const orders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate step counts and conversions
    const stepCounts = funnelSteps.map(step => {
      const count = interactions.filter(i => {
        switch (step.name) {
          case 'View Product': return i.type === 'view_product';
          case 'Add to Cart': return i.type === 'add_to_cart';
          case 'Checkout': return i.type === 'start_checkout';
          case 'Complete Purchase': return i.type === 'complete_purchase';
          default: return false;
        }
      }).length;
      return count;
    });

    // Calculate conversions and dropoffs
    const stepConversions = stepCounts.map((count, index) => {
      if (index === 0) return 100;
      return (count / stepCounts[index - 1]) * 100;
    });

    const stepDropoffs = stepCounts.map((count, index) => {
      if (index === 0) return 0;
      return ((stepCounts[index - 1] - count) / stepCounts[index - 1]) * 100;
    });

    // Build funnel data
    const funnelData = [
      {
        id: '1',
        name: 'Product Purchase',
        steps: funnelSteps.map((step, i) => ({
          id: step.id,
          name: step.name,
          count: stepCounts[i],
          conversion: stepConversions[i],
          dropoff: stepDropoffs[i],
        })),
        totalConversion: stepConversions[stepConversions.length - 1],
        averageTime: calculateAverageTime(interactions),
      },
    ];

    // Calculate metrics
    const totalFunnels = funnelData.length;
    const averageConversion = funnelData.reduce((sum, f) => sum + f.totalConversion, 0) / totalFunnels;
    const totalUsers = funnelData.reduce((sum, f) => sum + (f.steps[0]?.count || 0), 0);
    const averageTime = funnelData.reduce((sum, f) => sum + f.averageTime, 0) / totalFunnels;

    // Calculate trends (comparing with previous period)
    const previousPeriod = new Date();
    previousPeriod.setMonth(previousPeriod.getMonth() - 1);
    
    const previousInteractions = await prisma.userInteraction.findMany({
      where: {
        type: { in: ['view_product', 'add_to_cart', 'start_checkout', 'complete_purchase'] },
        timestamp: { lt: previousPeriod },
      },
    });

    const previousOrders = await prisma.order.findMany({
      where: { 
        status: 'DELIVERED',
        createdAt: { lt: previousPeriod },
      },
    });

    const previousStepCounts = funnelSteps.map(step => {
      const count = previousInteractions.filter(i => {
        switch (step.name) {
          case 'View Product': return i.type === 'view_product';
          case 'Add to Cart': return i.type === 'add_to_cart';
          case 'Checkout': return i.type === 'start_checkout';
          case 'Complete Purchase': return i.type === 'complete_purchase';
          default: return false;
        }
      }).length;
      return count;
    });

    const previousTotalUsers = previousStepCounts[0] || 0;
    const previousConversion = previousStepCounts[previousStepCounts.length - 1] / previousTotalUsers * 100 || 0;

    const trends = {
      totalFunnels: 0, // No change in number of funnels
      averageConversion: previousConversion ? ((averageConversion - previousConversion) / previousConversion) * 100 : 0,
      totalUsers: previousTotalUsers ? ((totalUsers - previousTotalUsers) / previousTotalUsers) * 100 : 0,
      averageTime: 0, // No previous time data
    };

    // Build chart data from actual interactions
    const chartData = funnelSteps.map((step, index) => ({
      name: step.name,
      value: stepCounts[index],
    }));

    return NextResponse.json({
      metrics: {
        totalFunnels,
        averageConversion,
        totalUsers,
        averageTime,
      },
      trends,
      funnelData,
      chartData,
    });
  } catch (error) {
    console.error('Funnel analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateAverageTime(interactions: any[]): number {
  const completedFunnels = [];
  for (let i = 0; i < interactions.length; i++) {
    if (interactions[i].type === 'complete_purchase') {
      const startTime = interactions.find(
        (interaction, index) => 
          index > i && interaction.type === 'view_product'
      )?.timestamp;
      
      if (startTime) {
        const duration = (interactions[i].timestamp.getTime() - startTime.getTime()) / 1000 / 60; // in minutes
        completedFunnels.push(duration);
      }
    }
  }
  
  return completedFunnels.length ? 
    completedFunnels.reduce((a, b) => a + b, 0) / completedFunnels.length : 
    0;
} 