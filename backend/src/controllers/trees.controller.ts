import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
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
        relationships: true,
        accessControl: true
      }
    });

    if (!tree) {
      res.status(404).json({ error: 'Tree not found or access denied' });
      return;
    }

    // Determine the role of the requesting user
    const userAccess = tree.accessControl.find(ac => ac.userId === userId);
    const currentUserRole = userAccess ? userAccess.role : 'viewer';

    res.status(200).json({ ...tree, currentUserRole });
  } catch (error) {
    console.error('Get tree by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const inviteUserToTree = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id: treeId } = req.params;
    const { email, role } = req.body;

    // Check if requester is admin
    const requesterAccess = await prisma.accessControl.findFirst({
      where: { treeId: treeId as string, userId: userId as string, role: 'admin' }
    });

    if (!requesterAccess) {
      res.status(403).json({ error: 'Only admins can invite members' });
      return;
    }

    // Find the user being invited
    const invitedUser = await prisma.user.findUnique({ where: { email } });
    if (!invitedUser) {
      res.status(404).json({ error: 'User not found in the system' });
      return;
    }

    // Create or update access control
    const access = await prisma.accessControl.upsert({
      where: {
        treeId_userId: { treeId: treeId as string, userId: invitedUser.id }
      },
      update: {
        role: role as Role
      },
      create: {
        treeId: treeId as string,
        userId: invitedUser.id,
        role: role as Role
      }
    });

    res.status(200).json(access);
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTreeAccessList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id: treeId } = req.params;

    // Basic check to ensure requester has access to the tree
    const hasAccess = await prisma.accessControl.findFirst({
      where: { treeId: treeId as string, userId: userId as string }
    });

    if (!hasAccess) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const accessList = await prisma.accessControl.findMany({
      where: { treeId: treeId as string },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(200).json(accessList);
  } catch (error) {
    console.error('Get tree access list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
