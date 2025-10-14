import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { uploadTaskFile } from '../controllers/upload.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:taskId', requireAuth, upload.single('file'), uploadTaskFile);

export default router