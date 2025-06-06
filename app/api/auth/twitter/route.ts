import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirect_uri = searchParams.get('redirect_uri');
  const state = Math.random().toString(36).substring(2);
  const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri || '')}&scope=tweet.read%20users.read%20offline.access%20email&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
  return NextResponse.redirect(twitterAuthUrl);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Fetch user info from Twitter
    const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username,email', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: 'Invalid Twitter token' }, { status: 401 });
    }
    const userData = await userRes.json();
    const twitterUser = userData.data;
    if (!twitterUser || !twitterUser.username) {
      return NextResponse.json({ error: 'Twitter account has no username' }, { status: 400 });
    }
    // Twitter API may not return email, so use username as fallback
    const email = twitterUser.email || `${twitterUser.username}@twitter.com`;

    // Check if user is already logged in (account linking)
    if (session && session.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // Check if Twitter account is already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'twitter',
          providerAccountId: twitterUser.id,
        },
      });
      if (existingAccount && existingAccount.userId !== user.id) {
        return NextResponse.json({ error: 'This Twitter account is already linked to another user.' }, { status: 409 });
      }
      // Link Twitter account
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'twitter',
            providerAccountId: twitterUser.id,
          },
        },
        update: {
          userId: user.id,
          access_token: token,
        },
        create: {
          userId: user.id,
          provider: 'twitter',
          providerAccountId: twitterUser.id,
          access_token: token,
          type: 'oauth',
        },
      });
      return NextResponse.json({ message: 'Twitter account linked.' });
    }

    // Not logged in: sign in or sign up
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: twitterUser.name,
          image: twitterUser.profile_image_url,
          emailVerified: true,
          accounts: {
            create: {
              provider: 'twitter',
              providerAccountId: twitterUser.id,
              access_token: token,
              type: 'oauth',
            },
          },
        },
      });
    } else {
      // Link Twitter account if not already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: 'twitter',
          providerAccountId: twitterUser.id,
        },
      });
      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'twitter',
            providerAccountId: twitterUser.id,
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
    console.error('Twitter OAuth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 