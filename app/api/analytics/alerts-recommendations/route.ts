import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch alerts from AutomationAlert table
    const alerts = await prisma.automationAlert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // Fetch recommendations from OptimizationRecommendation table
    const recommendations = await prisma.optimizationRecommendation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Map alerts to expected frontend structure
    const mappedAlerts = alerts.map((alert: any) => ({
      id: alert.id,
      type: alert.type.toLowerCase(),
      title: alert.type + ' Alert',
      message: alert.message,
      timestamp: alert.timestamp,
      category: alert.platform || 'General',
      status: alert.status || 'active',
      resolution: alert.resolution || null,
    }));

    // Map recommendations to expected frontend structure
    const mappedRecommendations = recommendations.map((rec: any) => ({
      id: rec.id,
      type: rec.type,
      title: rec.title,
      description: rec.description,
      impact: rec.impact,
      effort: rec.effort,
      priority: rec.priority,
      createdAt: rec.createdAt,
      updatedAt: rec.updatedAt,
    }));

    return NextResponse.json({ alerts: mappedAlerts, recommendations: mappedRecommendations });
  } catch (error) {
    console.error('Error fetching alerts and recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts and recommendations' }, { status: 500 });
  }
} 