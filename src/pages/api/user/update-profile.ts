import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { headline, bio, avatarUrl, isPublic } = req.body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        headline,
        bio,
        avatarUrl,
        isPublic,
      },
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
