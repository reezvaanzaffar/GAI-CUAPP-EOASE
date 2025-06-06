import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function DELETE(req: Request, { params }: { params: { sessionToken: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const cookieStore = cookies();
  const currentSessionToken = cookieStore.get('session_token')?.value;
  if (params.sessionToken === currentSessionToken) {
    return NextResponse.json({ error: 'Cannot revoke current session' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const sessionToDelete = await prisma.session.findUnique({ where: { sessionToken: params.sessionToken } });
  if (!sessionToDelete || sessionToDelete.userId !== user.id) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  await prisma.session.delete({ where: { sessionToken: params.sessionToken } });
  return NextResponse.json({ success: true });
} 