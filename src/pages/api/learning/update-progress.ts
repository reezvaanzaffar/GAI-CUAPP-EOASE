import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { StepStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { stepId, status } = req.body;

  if (!stepId || !status || !Object.values(StepStatus).includes(status)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId,
        },
      },
      update: {
        status,
      },
      create: {
        userId: session.user.id,
        stepId,
        status,
      },
    });

    return res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
