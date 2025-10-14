import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { getCurrentUser } from '../controllers/user.controller';

const router = Router();

router.get('/me', requireAuth, getCurrentUser);

export default router;