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
exports.downloadFile = exports.getFiles = void 0;
exports.deleteFileHandler = deleteFileHandler;
const files_service_1 = require("../services/files.service");
const file_repository_1 = require("../repositories/file.repository");
const files_service_2 = require("../services/files.service");
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield (0, file_repository_1.getAllTaskFilesWithMeta)();
        res.json(files);
    }
    catch (err) {
        console.error('[files/list] Error:', err);
        res.status(500).json({ error: 'Error al obtener archivos' });
    }
});
exports.getFiles = getFiles;
function deleteFileHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fileUuid } = req.params;
        try {
            yield (0, files_service_1.deleteFile)(fileUuid);
            res.status(204).send();
        }
        catch (error) {
            console.error('[deleteFile] Error:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
        }
    });
}
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileUuid = req.params.fileUuid;
        if (!fileUuid) {
            return res.status(400).json({ error: 'UUID inválido' });
        }
        const { filePath, originalName } = yield (0, files_service_2.getFileDownloadData)(fileUuid);
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error('[downloadFile] Error al descargar:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error al descargar archivo' });
                }
            }
        });
    }
    catch (error) {
        console.error('[downloadFile] Error:', error.message);
        if (!res.headersSent) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }
});
exports.downloadFile = downloadFile;
