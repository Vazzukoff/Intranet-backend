import { deleteFile } from "../services/files.service";
import { Request, Response } from "express";
import { getAllTaskFilesWithMeta } from "../repositories/file.repository";
import { getFileDownloadData } from "../services/files.service";

export const getFiles = async (
  req: Request,
  res: Response
) => {
    try {
      const files = await getAllTaskFilesWithMeta();
      res.json(files);
    } catch (err) {
      console.error('[files/list] Error:', err);
      res.status(500).json({ error: 'Error al obtener archivos' });
    }
}

export async function deleteFileHandler(
  req: Request, 
  res: Response
): Promise<void> {
  const { fileUuid } = req.params;
  try {
      await deleteFile(fileUuid);
      res.status(204).send();
  } catch (error) {
      console.error('[deleteFile] Error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
  }
}

export const downloadFile = async (
  req: Request,
  res: Response
) => {
  try {
    const fileUuid = req.params.fileUuid;
    
    if (!fileUuid) {
      return res.status(400).json({ error: 'UUID inválido' });
    }

    const { filePath, originalName } = await getFileDownloadData(fileUuid);

    res.download(filePath, originalName, (err) => {
      if (err) {
        console.error('[downloadFile] Error al descargar:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al descargar archivo' });
        }
      }
    });
  } catch (error: any) {
    console.error('[downloadFile] Error:', error.message);
    if (!res.headersSent) {
      const status = error.message.includes('no encontrado') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
};