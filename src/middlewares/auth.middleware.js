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
exports.requireAuth = void 0;
const session_server_1 = require("../session.server");
const security_1 = require("../utils/security");
const user_repository_1 = require("../repositories/user.repository");
const auth_errors_1 = require("../errors/auth.errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, session_server_1.getUserToken)(req);
        if (!token) {
            next(new auth_errors_1.NoTokenError());
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, security_1.SECRET_KEY);
        if (!decoded || !decoded.id) {
            next(new auth_errors_1.InvalidTokenError());
            return;
        }
        const userId = Number(decoded.id);
        const user = yield (0, user_repository_1.getUserById)(userId);
        if (!user) {
            res.status(401).json({ error: 'Usuario no encontrado' });
            return;
        }
        req.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        next();
    }
    catch (error) {
        console.error("❗ Error capturado en requireAuth:", error);
        res.status(401).json({ error: 'Tokessssssn inválido o expiras' });
    }
});
exports.requireAuth = requireAuth;
