import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { mentorId, message } = req.body;

  if (!mentorId || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Ensure the user is not requesting mentorship from themselves
  if (mentorId === session.user.id) {
    return res.status(400).json({ message: 'Cannot request mentorship from yourself' });
  }

  try {
    // Get the mentee's profile to verify they are a STARTUP_SAM
    const menteeProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!menteeProfile || menteeProfile.persona !== 'STARTUP_SAM') {
      return res.status(403).json({ message: 'Only Startup Sam can request mentorship' });
    }

    // Get the mentor's profile to verify they are a SCALING_SARAH
    const mentorProfile = await prisma.profile.findUnique({
      where: {
        userId: mentorId,
      },
    });

    if (!mentorProfile || mentorProfile.persona !== 'SCALING_SARAH') {
      return res.status(403).json({ message: 'Can only request mentorship from Scaling Sarah' });
    }

    // Check if a request already exists
    const existingRequest = await prisma.mentorshipRequest.findFirst({
      where: {
        mentorId,
        menteeId: session.user.id,
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A mentorship request already exists' });
    }

    // Create the mentorship request
    const mentorshipRequest = await prisma.mentorshipRequest.create({
      data: {
        mentorId,
        menteeId: session.user.id,
        message,
        status: 'PENDING',
      },
    });

    return res.status(200).json(mentorshipRequest);
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
