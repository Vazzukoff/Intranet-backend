import fs from "fs";
import path from 'path';
import { deleteFileFromDB, getFileById, getFileByUuid } from "../repositories/file.repository";

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads/');

export async function deleteFile(fileUuid: string): Promise<void> {
  // 1. Buscar el archivo en la BD
  const fileRecord = await getFileByUuid(fileUuid);
  if (!fileRecord) {
    throw new Error('Archivo no encontrado en base de datos');
  }

  // 2. Construir la ruta usando directamente file_uuid (que ya tiene la extensión)
  const filePath = path.join(UPLOAD_DIR, fileRecord.file_uuid);

  // 3. Eliminar archivo del sistema
  try {
    console.log('[deleteFile] Intentando eliminar archivo en:', filePath);
    await fs.promises.unlink(filePath);
    console.log('[deleteFile] Archivo físico eliminado exitosamente');
  } catch (err: any) {
    console.warn(`[deleteFile] Error al eliminar archivo del sistema: ${filePath}`, err);
    // Si el archivo no existe (ENOENT), continuar con la eliminación de BD
    if (err.code !== 'ENOENT') {
      throw new Error('Error al eliminar archivo físico del servidor');
    }
  }

  // 4. Eliminar registro de la BD
  const fileDeleted = await deleteFileFromDB(fileUuid);
  if (!fileDeleted) {
    throw new Error('Error al eliminar registro en base de datos');
  }
  
  console.log('[deleteFile] Archivo eliminado completamente:', fileUuid);
}

export const getFileDownloadData = async (
  fileUuid: string
): Promise<{
  filePath: string,
  originalName: string
}> => {
  const file = await getFileByUuid(fileUuid);
  
  if (!file) {
    throw new Error('Archivo no encontrado');
  }

  // Usar file.file_uuid que ahora contiene el nombre completo con extensión
  const filePath = path.join(process.cwd(), 'src', 'uploads', file.file_uuid);
  
  // Verificar que el archivo existe físicamente antes de intentar descargarlo
  try {
    await fs.promises.access(filePath);
  } catch (err) {
    console.error('[getFileDownloadData] Archivo no existe en disco:', filePath);
    throw new Error('Archivo no encontrado en el servidor');
  }

  return {
    filePath,
    originalName: file.original_name
  };
};