import {  Request, Response } from "express";
import { CreateUserDTO } from "../interfaces/user.interface";
import { register, login } from "../services/auth.service";
import { UsernameAlreadyExistsError } from "../errors/auth.errors";

export async function registerUser(
    req: Request,
    res: Response
) {
    const { username, password } = req.body as CreateUserDTO;
    
    try {
        const user = await register({ username, password });
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof UsernameAlreadyExistsError) {
            return res.status(error.status).json({ 
                message: error.message,
                code: error.code 
            });
        }

        console.error('Error en el registro', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function loginUser(
    req: Request,
    res: Response
) {
    try {
        const { user } = await login(req.body, res);
        res.status(200).json({ user });
    }   catch (error: any) {
        res.status(400).json({ error: error.message});
    }
}