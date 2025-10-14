import { pool } from '../db/connection'
import { FileRecord } from '../interfaces/file.interface';

export async function getFileByUuid(fileUuid: string) {
  try {
    const result = await pool.query(
      'SELECT file_uuid, mime_type, original_name FROM task_files WHERE file_uuid = $1',
      [fileUuid]
    );
    return result.rows[0] || null;
  } catch (dbErr) {
    console.error('[getFileByUuid] Error PG:', dbErr);
    throw new Error('Error de base de datos al obtener archivo');
  }
}

export async function deleteFileFromDB(
  fileUuid: string
): Promise<boolean> {
  let result;
  try {
    console.log('[deleteFileFromDB] Eliminando ID:', fileUuid);
    result = await pool.query(
      'DELETE FROM task_files WHERE file_uuid = $1 RETURNING *',
      [fileUuid]
    );
  } catch (dbErr) {
    console.error('[deleteFileFromDB] Error PG:', dbErr);
    throw new Error('Error de base de datos al eliminar el archivo de la tarea');
  }
  return (result?.rowCount ?? 0) > 0;
}

export async function getAllTaskFilesWithMeta() {
  const result = await pool.query(`
    SELECT 
      f.id,
      f.original_name,
      f.file_uuid,
      f.mime_type,
      f.size_bytes,
      f.uploaded_at,
      u.username    AS uploaded_by_name,
      t.title       AS task_title
    FROM task_files f
    JOIN users u ON f.uploaded_by = u.id
    JOIN tasks t ON f.task_id = t.id
    ORDER BY f.id DESC;
  `);
  return result.rows;
}


export const getFileById = async (id: number): Promise<{ filename: string, original_name: string } | null> => {
  const { rows } = await pool.query(
    `SELECT filename, original_name FROM task_files WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function getTaskFileById(fileId: number): Promise<FileRecord | null> {
  const result = await pool.query<FileRecord>(
    `SELECT id, task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by, uploaded_at
     FROM task_files
     WHERE id = $1`,
    [fileId]
  );
  return result.rows[0] || null;
}