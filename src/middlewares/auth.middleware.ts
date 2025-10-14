import { Response, NextFunction } from "express";
import { getUserToken } from "../session.server";
import { SECRET_KEY } from "../utils/security";
import { getUserById } from "../repositories/user.repository"
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { InvalidTokenError, NoTokenError } from "../errors/auth.errors";
import jwt from "jsonwebtoken";

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getUserToken(req);
    if (!token) {
      next(new NoTokenError());
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY as string) as unknown as { id: string };
    if (!decoded || !decoded.id) {
      next(new InvalidTokenError());
      return;
    }
    const userId = Number(decoded.id);

    const user = await getUserById(userId);
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
  }  catch (error) {
    console.error("❗ Error capturado en requireAuth:", error);
      res.status(401).json({ error: 'Tokessssssn inválido o expiras' });
  }};
