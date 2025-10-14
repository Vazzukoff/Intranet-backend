import { saveTaskFile } from '../repositories/task.repository';
import { SavedFileDTO, FileRecord } from '../interfaces/file.interface';

export async function uploadTaskFileService(
  taskId: number,
  storedName: string,
  originalName: string,
  mimeType: string,
  size: number,
  userId: number
): Promise<SavedFileDTO> {

  const record: FileRecord = await saveTaskFile(
    taskId,
    storedName,
    originalName,
    mimeType,
    size,
    userId
  );

  // Map FileRecord to SavedFileDTO
  const savedFile: SavedFileDTO = {
    id: record.id,
    fileUuid: record.file_uuid,
    filename: record.filename,
    originalName: record.original_name,
    mimeType: record.mime_type,
    size: record.size_bytes,
    uploadedBy: record.uploaded_by,
    uploadedAt: record.uploaded_at,
  };

  return savedFile;
}