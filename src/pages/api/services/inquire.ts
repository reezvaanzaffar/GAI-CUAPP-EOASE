import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { serviceId, message } = req.body;

  if (!serviceId || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verify the service exists and is published
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Service is not available' });
    }

    // Create the inquiry
    const inquiry = await prisma.serviceInquiry.create({
      data: {
        serviceId,
        inquiringUserId: session.user.id,
        message,
      },
    });

    return res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating service inquiry:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
