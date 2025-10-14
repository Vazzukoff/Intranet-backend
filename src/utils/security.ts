import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const SECRET_KEY = process.env.JWT_SECRET 
const SALT_ROUNDS = 10;

export async function hashPassword(
    password: string
): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

export function generateToken(
    payload: object
): string {
    if (!SECRET_KEY) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword)
}