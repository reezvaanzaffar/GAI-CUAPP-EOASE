import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const leads = await prisma.lead.findMany();
  return NextResponse.json(leads);
} 