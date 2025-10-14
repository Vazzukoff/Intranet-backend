export interface SavedFileDTO {
  id: number;
  fileUuid: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
  uploadedAt: string;
}

export interface FileRecord {
  id: number;
  task_id: number;
  file_uuid: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: number;
  uploaded_at: string;
}