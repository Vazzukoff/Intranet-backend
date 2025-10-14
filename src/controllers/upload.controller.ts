import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { uploadTaskFileService } from '../services/upload.service';

export async function uploadTaskFile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const taskId = Number(req.params.taskId);
  const file = req.file;
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }
  const userId = req.user.id;

  if (!file) {
    res.status(400).json({ error: 'Archivo no proporcionado' });
    return;
  }

  try {
    
    const savedFile = await uploadTaskFileService(
      taskId,
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      userId
    );

    res.status(201).json({
      message: 'Archivo subido exitosamente',
      file: savedFile,
    });
  } catch (err: any) {
    console.error('[uploadTaskFile] Error:', err);
    res.status(500).json({ error: err.message || 'Error al guardar el archivo' });
  }
}
