import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { createTree, getTrees, getTreeById } from '../controllers/trees.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createTree);
router.get('/', getTrees);
router.get('/:id', getTreeById);

export default router;
