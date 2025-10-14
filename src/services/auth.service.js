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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
const connection_1 = require("../db/connection");
const security_1 = require("../utils/security");
const security_2 = require("../utils/security");
const session_server_1 = require("../session.server");
const user_repository_1 = require("../repositories/user.repository");
const auth_errors_1 = require("../errors/auth.errors");
function register(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = user;
        const existingUser = yield (0, user_repository_1.getUserbyUsername)(username);
        if (existingUser) {
            throw new auth_errors_1.UsernameAlreadyExistsError();
        }
        const hashedPassword = yield (0, security_1.hashPassword)(password);
        const newUser = yield (0, user_repository_1.createUser)({ username, password: hashedPassword });
        return newUser;
    });
}
function login(_a, res_1) {
    return __awaiter(this, arguments, void 0, function* ({ username, password }, res) {
        const result = yield connection_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            throw new auth_errors_1.InvalidCredentialsError();
        }
        const isPasswordValid = yield (0, security_2.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new auth_errors_1.InvalidCredentialsError();
        }
        const token = (0, security_2.generateToken)(user);
        (0, session_server_1.createUserSession)(res, token);
        const { password: _ } = user, userData = __rest(user, ["password"]);
        return {
            user: userData
        };
    });
}
function logout(_, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie('auth_token', '', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
}
