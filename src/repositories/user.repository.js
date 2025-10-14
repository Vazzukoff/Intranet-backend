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
exports.createUser = createUser;
exports.getUserbyUsername = getUserbyUsername;
exports.getUserById = getUserById;
const connection_1 = require("../db/connection");
function createUser(user_1) {
    return __awaiter(this, arguments, void 0, function* (user, role = 'employee') {
        const { username, password } = user;
        const result = yield connection_1.pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role', [username, password, role]);
        return result.rows[0];
    });
}
function getUserbyUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0] || null;
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT id, username, role FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        return result.rows[0];
    });
}
