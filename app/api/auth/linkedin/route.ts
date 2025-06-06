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

    // Fetch user info from LinkedIn
    const profileRes = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const emailRes = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok || !emailRes.ok) {
      return NextResponse.json({ error: 'Invalid LinkedIn token' }, { status: 401 });
    }
    const profile = await profileRes.json();
    const emailData = await emailRes.json();
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'LinkedIn account has no email' }, { status: 400 });
    }

    // Check if user is already logged in (account linking)
    if (session && session.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // Check if LinkedIn account is already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'linkedin',
          providerAccountId: profile.id,
        },
      });
      if (existingAccount && existingAccount.userId !== user.id) {
        return NextResponse.json({ error: 'This LinkedIn account is already linked to another user.' }, { status: 409 });
      }
      // Link LinkedIn account
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'linkedin',
            providerAccountId: profile.id,
          },
        },
        update: {
          userId: user.id,
          access_token: token,
        },
        create: {
          userId: user.id,
          provider: 'linkedin',
          providerAccountId: profile.id,
          access_token: token,
          type: 'oauth',
        },
      });
      return NextResponse.json({ message: 'LinkedIn account linked.' });
    }

    // Not logged in: sign in or sign up
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: `${profile.localizedFirstName || ''} ${profile.localizedLastName || ''}`.trim(),
          image: null,
          emailVerified: true,
          accounts: {
            create: {
              provider: 'linkedin',
              providerAccountId: profile.id,
              access_token: token,
              type: 'oauth',
            },
          },
        },
      });
    } else {
      // Link LinkedIn account if not already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'linkedin',
          providerAccountId: profile.id,
        },
      });
      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'linkedin',
            providerAccountId: profile.id,
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
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 