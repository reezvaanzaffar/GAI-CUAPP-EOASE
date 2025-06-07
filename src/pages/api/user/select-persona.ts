import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { UserPersona } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { persona } = req.body;

    if (!persona || !Object.values(UserPersona).includes(persona)) {
      return res.status(400).json({ message: 'Invalid persona' });
    }

    // Update or create the user's profile
    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        persona,
        // Initialize persona-specific data
        personaData: {
          // Add default data based on persona
          ...(persona === UserPersona.SCALING_SARAH && {
            monthlyRevenue: 0,
            teamSize: 0,
          }),
          ...(persona === UserPersona.STARTUP_SAM && {
            capital: 0,
            launchDate: null,
          }),
          // Add other persona-specific data as needed
        },
      },
      create: {
        userId: session.user.id,
        persona,
        personaData: {
          // Add default data based on persona
          ...(persona === UserPersona.SCALING_SARAH && {
            monthlyRevenue: 0,
            teamSize: 0,
          }),
          ...(persona === UserPersona.STARTUP_SAM && {
            capital: 0,
            launchDate: null,
          }),
          // Add other persona-specific data as needed
        },
      },
    });

    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Error selecting persona:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
