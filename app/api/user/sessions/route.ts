import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      sessionToken: true,
      createdAt: true,
      expires: true,
      ipAddress: true,
      userAgent: true,
    },
  });
  return NextResponse.json({ sessions });
} 