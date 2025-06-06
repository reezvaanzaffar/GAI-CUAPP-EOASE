import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

export async function GET() {
  // const alerts = await prisma.leadAlert.findMany();
  // return NextResponse.json(alerts);
  return NextResponse.json([]);
} 