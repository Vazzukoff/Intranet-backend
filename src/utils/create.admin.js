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
const security_1 = require("./security");
const connection_1 = require("../db/connection");
function createAdmin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield (0, security_1.hashPassword)(password);
            const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, 'admin')
      RETURNING *;
    `;
            const result = yield connection_1.pool.query(query, [username, hashedPassword]);
            console.log('Usuario admin creado:', result.rows[0]);
        }
        catch (err) {
            console.error('Error creando usuario admin:', err);
        }
        finally {
            yield connection_1.pool.end();
        }
    });
}
createAdmin('admin', 'admin');
