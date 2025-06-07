import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { MentorshipRequestStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { requestId, response } = req.body;

  if (!requestId || !response) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['ACCEPTED', 'DECLINED'].includes(response)) {
    return res.status(400).json({ message: 'Invalid response' });
  }

  try {
    // Verify the request exists and belongs to the user
    const request = await prisma.mentorshipRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.mentorId !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request has already been responded to' });
    }

    // Update the request status
    const updatedRequest = await prisma.mentorshipRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: response as MentorshipRequestStatus,
      },
    });

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error responding to mentorship request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
