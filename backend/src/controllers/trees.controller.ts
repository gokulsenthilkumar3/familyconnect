import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createTree = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, isPublic } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Tree name is required' });
      return;
    }

    const tree = await prisma.familyTree.create({
      data: {
        name,
        ownerId: userId,
        isPublic: isPublic || false,
        accessControl: {
          create: {
            userId: userId,
            role: 'admin' // The creator is the admin
          }
        }
      }
    });

    res.status(201).json(tree);
  } catch (error) {
    console.error('Create tree error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const trees = await prisma.familyTree.findMany({
      where: {
        accessControl: {
          some: {
            userId: userId
          }
        }
      }
    });

    res.status(200).json(trees);
  } catch (error) {
    console.error('Get trees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTreeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const tree = await prisma.familyTree.findFirst({
      where: {
        id: id as string,
        accessControl: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: true,
        relationships: true
      }
    });

    if (!tree) {
      res.status(404).json({ error: 'Tree not found or access denied' });
      return;
    }

    res.status(200).json(tree);
  } catch (error) {
    console.error('Get tree by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
