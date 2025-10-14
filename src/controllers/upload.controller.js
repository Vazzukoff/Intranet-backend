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
exports.uploadTaskFile = uploadTaskFile;
const upload_service_1 = require("../services/upload.service");
function uploadTaskFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const savedFile = yield (0, upload_service_1.uploadTaskFileService)(taskId, file.filename, file.originalname, file.mimetype, file.size, userId);
            res.status(201).json({
                message: 'Archivo subido exitosamente',
                file: savedFile,
            });
        }
        catch (err) {
            console.error('[uploadTaskFile] Error:', err);
            res.status(500).json({ error: err.message || 'Error al guardar el archivo' });
        }
    });
}
