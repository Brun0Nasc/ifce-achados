import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model';
import config from '../config';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        return
    }

    try {
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Credenciais inválidas.' });
            return 
        }

        const payload = {
            userId: user._id, 
            role: user.role
        };

        const token = jwt.sign(
            payload,
            config.jwt.secret,
            { expiresIn: Number(config.jwt.expiresIn) }
        );

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            user: { id: user._id, name: user.name, email: user.email }
         });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno no servidor durante o login.' });
    }
};