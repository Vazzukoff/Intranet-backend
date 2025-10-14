"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_controller_1 = require("../controllers/file.controller");
const router = (0, express_1.Router)();
router.get('/list', file_controller_1.getFiles);
router.delete('/delete/:fileUuid', file_controller_1.deleteFileHandler);
router.get('/download/:fileUuid', file_controller_1.downloadFile);
exports.default = router;
