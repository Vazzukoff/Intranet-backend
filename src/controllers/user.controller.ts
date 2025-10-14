import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export const getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { user } = req;
    res.status(200).json({ user });
}