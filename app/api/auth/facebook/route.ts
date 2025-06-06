import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Fetch user info from Facebook
    const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    if (!fbRes.ok) {
      return NextResponse.json({ error: 'Invalid Facebook token' }, { status: 401 });
    }
    const fbUser = await fbRes.json();
    if (!fbUser.email) {
      return NextResponse.json({ error: 'Facebook account has no email' }, { status: 400 });
    }

    // Check if user is already logged in (account linking)
    if (session && session.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // Check if Facebook account is already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'facebook',
          providerAccountId: fbUser.id,
        },
      });
      if (existingAccount && existingAccount.userId !== user.id) {
        return NextResponse.json({ error: 'This Facebook account is already linked to another user.' }, { status: 409 });
      }
      // Link Facebook account
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'facebook',
            providerAccountId: fbUser.id,
          },
        },
        update: {
          userId: user.id,
          access_token: token,
        },
        create: {
          userId: user.id,
          provider: 'facebook',
          providerAccountId: fbUser.id,
          access_token: token,
          type: 'oauth',
        },
      });
      return NextResponse.json({ message: 'Facebook account linked.' });
    }

    // Not logged in: sign in or sign up
    let user = await prisma.user.findUnique({ where: { email: fbUser.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: fbUser.email,
          name: fbUser.name,
          image: fbUser.picture?.data?.url || null,
          emailVerified: true,
          accounts: {
            create: {
              provider: 'facebook',
              providerAccountId: fbUser.id,
              access_token: token,
              type: 'oauth',
            },
          },
        },
      });
    } else {
      // Link Facebook account if not already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'facebook',
          providerAccountId: fbUser.id,
        },
      });
      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'facebook',
            providerAccountId: fbUser.id,
            access_token: token,
            type: 'oauth',
          },
        });
      }
    }
    // Create session token (reuse Google/GitHub logic if available)
    // ... session creation logic here ...
    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 