import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { createMember, getMembers } from '../controllers/members.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createMember);
router.get('/', getMembers);

export default router;
