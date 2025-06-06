import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Fetch all leads
  const leads = await prisma.lead.findMany();
  const totalLeads = leads.length;
  const activeStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION'];
  const convertedStatuses = ['WON', 'CLOSED'];
  const lostStatuses = ['LOST'];

  const activeLeads = leads.filter(l => activeStatuses.includes(l.status)).length;
  const convertedLeads = leads.filter(l => convertedStatuses.includes(l.status)).length;
  const lostLeads = leads.filter(l => lostStatuses.includes(l.status)).length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const averageValue = totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.expectedValue || 0), 0) / totalLeads) : 0;
  const totalPipelineValue = leads.filter(l => activeStatuses.includes(l.status)).reduce((sum, l) => sum + (l.expectedValue || 0), 0);

  // Average time to conversion (in days)
  const convertedLeadDates = leads.filter(l => convertedStatuses.includes(l.status) && l.createdAt && l.updatedAt);
  const averageTimeToConversion = convertedLeadDates.length > 0
    ? Math.round(convertedLeadDates.reduce((sum, l) => sum + ((l.updatedAt - l.createdAt) / (1000 * 60 * 60 * 24)), 0) / convertedLeadDates.length)
    : 0;

  // Lead source breakdown
  const sourceCounts = {};
  for (const l of leads) {
    if (!l.source) continue;
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  }
  const leadSourceBreakdown = Object.entries(sourceCounts).map(([source, count]) => ({ source, count }));

  // Stage distribution
  const stageCounts = {};
  for (const l of leads) {
    stageCounts[l.status] = (stageCounts[l.status] || 0) + 1;
  }
  const stageDistribution = Object.entries(stageCounts).map(([stage, count]) => ({ stage, count }));

  return NextResponse.json({
    overallMetrics: {
      totalLeads,
      activeLeads,
      convertedLeads,
      lostLeads,
      conversionRate,
      averageValue,
      totalPipelineValue,
      averageTimeToConversion,
      leadSourceBreakdown,
      stageDistribution,
    }
  });
} 