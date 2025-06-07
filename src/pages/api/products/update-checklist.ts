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

  const { itemId, isCompleted } = req.body;

  if (typeof itemId !== 'string' || typeof isCompleted !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    // Verify the checklist item belongs to a product owned by the user
    const checklistItem = await prisma.launchChecklistItem.findFirst({
      where: {
        id: itemId,
        product: {
          userId: session.user.id,
        },
      },
    });

    if (!checklistItem) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }

    const updatedItem = await prisma.launchChecklistItem.update({
      where: {
        id: itemId,
      },
      data: {
        isCompleted,
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
