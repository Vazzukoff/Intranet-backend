"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTaskFileService = uploadTaskFileService;
const task_repository_1 = require("../repositories/task.repository");
function uploadTaskFileService(taskId, storedName, originalName, mimeType, size, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield (0, task_repository_1.saveTaskFile)(taskId, storedName, originalName, mimeType, size, userId);
        // Map FileRecord to SavedFileDTO
        const savedFile = {
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
    });
}
