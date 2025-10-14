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
exports.getFileById = void 0;
exports.getFileByUuid = getFileByUuid;
exports.deleteFileFromDB = deleteFileFromDB;
exports.getAllTaskFilesWithMeta = getAllTaskFilesWithMeta;
exports.getTaskFileById = getTaskFileById;
const connection_1 = require("../db/connection");
function getFileByUuid(fileUuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield connection_1.pool.query('SELECT file_uuid, mime_type, original_name FROM task_files WHERE file_uuid = $1', [fileUuid]);
            return result.rows[0] || null;
        }
        catch (dbErr) {
            console.error('[getFileByUuid] Error PG:', dbErr);
            throw new Error('Error de base de datos al obtener archivo');
        }
    });
}
function deleteFileFromDB(fileUuid) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let result;
        try {
            console.log('[deleteFileFromDB] Eliminando ID:', fileUuid);
            result = yield connection_1.pool.query('DELETE FROM task_files WHERE file_uuid = $1 RETURNING *', [fileUuid]);
        }
        catch (dbErr) {
            console.error('[deleteFileFromDB] Error PG:', dbErr);
            throw new Error('Error de base de datos al eliminar el archivo de la tarea');
        }
        return ((_a = result === null || result === void 0 ? void 0 : result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    });
}
function getAllTaskFilesWithMeta() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`
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
    });
}
const getFileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield connection_1.pool.query(`SELECT filename, original_name FROM task_files WHERE id = $1`, [id]);
    return rows[0] || null;
});
exports.getFileById = getFileById;
function getTaskFileById(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT id, task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by, uploaded_at
     FROM task_files
     WHERE id = $1`, [fileId]);
        return result.rows[0] || null;
    });
}
