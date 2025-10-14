import { Request, Response } from "express";

const COOKIE_NAME = "auth_token";

/** Extrae el token desde la cookie */
export function getUserToken(
  req: Request
): string | null {
  return req.cookies?.[COOKIE_NAME] || null;
}

/** Crea la cookie de sesión con el token */
export function createUserSession(
  res: Response,
  token: string
) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 días en ms
  });
}