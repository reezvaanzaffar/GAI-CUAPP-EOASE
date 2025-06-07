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

  const { serviceId } = req.body;

  if (!serviceId) {
    return res.status(400).json({ message: 'Missing serviceId' });
  }

  try {
    // Verify the service exists and belongs to the user
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized to publish this service' });
    }

    if (service.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Service is not in draft status' });
    }

    // Update the service status
    const updatedService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        status: 'PUBLISHED',
      },
    });

    return res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error publishing service:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
