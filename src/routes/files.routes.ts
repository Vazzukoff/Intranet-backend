import { Router } from 'express';
import { getFiles, deleteFileHandler, downloadFile } from '../controllers/file.controller';

const router = Router();

router.get('/list', getFiles);
router.delete('/delete/:fileUuid', deleteFileHandler);
router.get('/download/:fileUuid', downloadFile);

export default router;