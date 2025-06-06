import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '@/lib/token';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user info from Google' },
        { status: 401 }
      );
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture, sub: providerAccountId } = userInfo;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Invalid user info from Google' },
        { status: 401 }
      );
    }

    // Check if user is already logged in (for account linking)
    const session = await getServerSession(authOptions);
    const currentUser = session?.user;

    let user;
    if (currentUser?.email) {
      // User is logged in - handle account linking
      user = await prisma.user.findUnique({
        where: { email: currentUser.email },
        include: { accounts: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Current user not found' },
          { status: 404 }
        );
      }

      // Check if Google account is already linked
      const existingAccount = user.accounts.find(
        (acc) => acc.provider === 'google' && acc.providerAccountId === providerAccountId
      );

      if (!existingAccount) {
        // Link the Google account
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId,
            access_token: token,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
          },
        });
      }
    } else {
      // Regular sign in - find or create user
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            image: picture || null,
            role: 'user',
            emailVerified: true, // Google accounts are pre-verified
          },
        });

        // Create Google account link
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId,
            access_token: token,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
          },
        });
      }
    }

    // Generate session token
    const sessionToken = await generateToken();

    // Extract IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Create session
    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        ipAddress,
        userAgent,
      },
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        token: sessionToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 