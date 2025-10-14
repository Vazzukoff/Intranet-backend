"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenError = exports.NoTokenError = exports.InvalidCredentialsError = exports.UsernameAlreadyExistsError = void 0;
const app_errors_1 = require("./app.errors");
class UsernameAlreadyExistsError extends app_errors_1.AppError {
    constructor() {
        super("El nombre de usuario ya existe", 409, "USERNAME_EXISTS");
    }
}
exports.UsernameAlreadyExistsError = UsernameAlreadyExistsError;
class InvalidCredentialsError extends app_errors_1.AppError {
    constructor() {
        super("Nombre de usuario o contraseña inválidos", 401, "INVALID_CREDENTIALS");
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class NoTokenError extends app_errors_1.AppError {
    constructor() {
        super("No se proporcionó un token", 401, "NO_TOKEN");
    }
}
exports.NoTokenError = NoTokenError;
class InvalidTokenError extends app_errors_1.AppError {
    constructor() {
        super("Token inválido", 401, "INVALID_TOKEN");
    }
}
exports.InvalidTokenError = InvalidTokenError;
