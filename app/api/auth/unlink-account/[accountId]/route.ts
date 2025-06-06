import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the account belongs to the user
    const account = user.accounts.find(
      (acc) => acc.id === params.accountId
    );

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Prevent unlinking the last authentication method
    if (user.accounts.length === 1) {
      return NextResponse.json(
        { error: 'Cannot unlink the last authentication method' },
        { status: 400 }
      );
    }

    // Delete the account
    await prisma.account.delete({
      where: { id: params.accountId },
    });

    return NextResponse.json({
      message: 'Account unlinked successfully',
    });
  } catch (error) {
    console.error('Error unlinking account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 