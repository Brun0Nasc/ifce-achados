import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';
import config from '../config';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
        return
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Email já cadastrado.' });
            return
        }

        const newUser = new UserModel({ name, email, password });
        await newUser.save();

        const payload = {
            userId: newUser._id,
            role: newUser.role
        };

        const token = jwt.sign(
            payload,
            config.jwt.secret,
            { expiresIn: Number(config.jwt.expiresIn) }
        );

        res.status(201).json({ 
            message: 'Usuário registrado com sucesso!',
            token: token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ message: 'Erro interno no servidor ao registrar usuário.' });
    }
};