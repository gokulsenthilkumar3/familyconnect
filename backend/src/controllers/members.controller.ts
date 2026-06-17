import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { treeId, name, birthDate, birthLocation, deathDate, gender, religion, bio, photoUrl } = req.body;

    if (!treeId || !name) {
      res.status(400).json({ error: 'TreeId and Name are required' });
      return;
    }

    // Check if user has access to this tree
    const access = await prisma.accessControl.findFirst({
      where: {
        treeId: treeId,
        userId: userId
      }
    });

    if (!access) {
      res.status(403).json({ error: 'Access denied to this family tree' });
      return;
    }

    const member = await prisma.member.create({
      data: {
        treeId,
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        birthLocation,
        deathDate: deathDate ? new Date(deathDate) : null,
        gender,
        religion,
        bio,
        photoUrl,
        createdById: userId
      }
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { treeId } = req.query;

    if (!treeId) {
      res.status(400).json({ error: 'treeId query parameter is required' });
      return;
    }

    // Check access
    const access = await prisma.accessControl.findFirst({
      where: {
        treeId: treeId as string,
        userId: userId
      }
    });

    if (!access) {
      res.status(403).json({ error: 'Access denied to this family tree' });
      return;
    }

    const members = await prisma.member.findMany({
      where: {
        treeId: treeId as string
      }
    });

    res.status(200).json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedMember = await prisma.member.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};
