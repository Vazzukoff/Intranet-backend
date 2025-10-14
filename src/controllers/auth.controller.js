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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const auth_service_1 = require("../services/auth.service");
const auth_errors_1 = require("../errors/auth.errors");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield (0, auth_service_1.register)({ username, password });
            res.status(201).json(user);
        }
        catch (error) {
            if (error instanceof auth_errors_1.UsernameAlreadyExistsError) {
                return res.status(error.status).json({
                    message: error.message,
                    code: error.code
                });
            }
            console.error('Error en el registro', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user } = yield (0, auth_service_1.login)(req.body, res);
            res.status(200).json({ user });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
