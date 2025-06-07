import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { ServiceCategory } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify user is a provider
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user || user.profile?.persona !== 'PROVIDER_PRIYA') {
    return res.status(403).json({ message: 'Only providers can create services' });
  }

  const { title, description, price, category } = req.body;

  if (!title || !description || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!Object.values(ServiceCategory).includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const service = await prisma.service.create({
      data: {
        providerId: session.user.id,
        title,
        description,
        price: parseFloat(price),
        category,
      },
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
