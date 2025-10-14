"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/:taskId', auth_middleware_1.requireAuth, upload_middleware_1.upload.single('file'), upload_controller_1.uploadTaskFile);
exports.default = router;
