import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is required' },
        { status: 400 }
      );
    }

    // Initialize GitHub client
    const octokit = new Octokit({ auth: token });

    // Get user data from GitHub
    const { data: githubUser } = await octokit.users.getAuthenticated();

    // Check if user is already logged in (account linking)
    if (session?.user?.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Check if GitHub account is already linked
      const existingGithubAccount = existingUser.accounts.find(
        (acc) => acc.provider === 'github' && acc.providerAccountId === githubUser.id.toString()
      );

      if (existingGithubAccount) {
        return NextResponse.json(
          { error: 'GitHub account already linked' },
          { status: 400 }
        );
      }

      // Link GitHub account
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          type: 'oauth',
          provider: 'github',
          providerAccountId: githubUser.id.toString(),
          access_token: token,
          token_type: 'bearer',
          scope: 'user:email',
        },
      });

      return NextResponse.json({
        message: 'GitHub account linked successfully',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider: 'github',
            providerAccountId: githubUser.id.toString(),
          },
        },
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: githubUser.email || `${githubUser.id}@github.user`,
          name: githubUser.name || githubUser.login,
          emailVerified: githubUser.email ? new Date() : null,
          accounts: {
            create: {
              type: 'oauth',
              provider: 'github',
              providerAccountId: githubUser.id.toString(),
              access_token: token,
              token_type: 'bearer',
              scope: 'user:email',
            },
          },
        },
      });
    }

    // Generate session token
    const sessionToken = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken: sessionToken.id,
    });
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with GitHub' },
      { status: 500 }
    );
  }
} 