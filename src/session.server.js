"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserToken = getUserToken;
exports.createUserSession = createUserSession;
const COOKIE_NAME = "auth_token";
/** Extrae el token desde la cookie */
function getUserToken(req) {
    var _a;
    return ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a[COOKIE_NAME]) || null;
}
/** Crea la cookie de sesión con el token */
function createUserSession(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 días en ms
    });
}
