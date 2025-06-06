import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params?: { leadId?: string } }) {
  let leadId = context?.params?.leadId;
  if (!leadId) {
    const match = req.url.match(/\/leads\/([^/]+)\/notes/);
    leadId = match ? match[1] : undefined;
    console.log('Extracted leadId from URL:', leadId);
  } else {
    console.log('leadId from params:', leadId);
  }
  if (!leadId) {
    return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
  }
  const notes = await prisma.leadNote.findMany({ where: { leadId } });
  return NextResponse.json(notes);
} 