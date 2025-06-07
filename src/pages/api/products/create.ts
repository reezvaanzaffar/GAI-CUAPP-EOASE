import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

const DEFAULT_CHECKLIST_ITEMS = [
  { title: 'Finalize Supplier', order: 1 },
  { title: 'Create Product Listing', order: 2 },
  { title: 'Launch PPC Campaign', order: 3 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        userId: session.user.id,
        checklist: {
          create: DEFAULT_CHECKLIST_ITEMS,
        },
      },
      include: {
        checklist: true,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
