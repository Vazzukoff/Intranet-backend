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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileDownloadData = void 0;
exports.deleteFile = deleteFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_repository_1 = require("../repositories/file.repository");
const UPLOAD_DIR = path_1.default.join(__dirname, '..', 'uploads/');
function deleteFile(fileUuid) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Buscar el archivo en la BD
        const fileRecord = yield (0, file_repository_1.getFileByUuid)(fileUuid);
        if (!fileRecord) {
            throw new Error('Archivo no encontrado en base de datos');
        }
        // 2. Construir la ruta usando directamente file_uuid (que ya tiene la extensión)
        const filePath = path_1.default.join(UPLOAD_DIR, fileRecord.file_uuid);
        // 3. Eliminar archivo del sistema
        try {
            console.log('[deleteFile] Intentando eliminar archivo en:', filePath);
            yield fs_1.default.promises.unlink(filePath);
            console.log('[deleteFile] Archivo físico eliminado exitosamente');
        }
        catch (err) {
            console.warn(`[deleteFile] Error al eliminar archivo del sistema: ${filePath}`, err);
            // Si el archivo no existe (ENOENT), continuar con la eliminación de BD
            if (err.code !== 'ENOENT') {
                throw new Error('Error al eliminar archivo físico del servidor');
            }
        }
        // 4. Eliminar registro de la BD
        const fileDeleted = yield (0, file_repository_1.deleteFileFromDB)(fileUuid);
        if (!fileDeleted) {
            throw new Error('Error al eliminar registro en base de datos');
        }
        console.log('[deleteFile] Archivo eliminado completamente:', fileUuid);
    });
}
const getFileDownloadData = (fileUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield (0, file_repository_1.getFileByUuid)(fileUuid);
    if (!file) {
        throw new Error('Archivo no encontrado');
    }
    // Usar file.file_uuid que ahora contiene el nombre completo con extensión
    const filePath = path_1.default.join(process.cwd(), 'src', 'uploads', file.file_uuid);
    // Verificar que el archivo existe físicamente antes de intentar descargarlo
    try {
        yield fs_1.default.promises.access(filePath);
    }
    catch (err) {
        console.error('[getFileDownloadData] Archivo no existe en disco:', filePath);
        throw new Error('Archivo no encontrado en el servidor');
    }
    return {
        filePath,
        originalName: file.original_name
    };
});
exports.getFileDownloadData = getFileDownloadData;
