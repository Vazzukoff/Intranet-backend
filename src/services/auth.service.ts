import { User, UserCredentials, CreateUserDTO } from "../interfaces/user.interface";
import { pool } from "../db/connection";
import { hashPassword } from "../utils/security";
import { generateToken, comparePassword } from "../utils/security";
import { createUserSession } from "../session.server";
import { Response } from "express";
import { createUser, getUserbyUsername } from "../repositories/user.repository";
import { UsernameAlreadyExistsError, InvalidCredentialsError } from "../errors/auth.errors";

export async function register(
    user: CreateUserDTO
): Promise <User> {
    const { username, password } = user;
    
    const existingUser = await getUserbyUsername(username)

    if (existingUser) {
        throw new UsernameAlreadyExistsError();
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ username, password: hashedPassword });

    return newUser;
}

export async function login(
    { username, password }: UserCredentials,
    res: Response
) {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]  
    );

    const user = result.rows[0];

    if (!user) {
        throw new InvalidCredentialsError();
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid) {
        throw new InvalidCredentialsError();
    }

    const token = generateToken(user);
    
    createUserSession(res, token);

    const { password: _, ...userData } = user;
    
    return {
        user: userData
    };
}

export async function logout(
    _: any,
    res: Response
) {
    res.cookie('auth_token', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    });
      
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
}