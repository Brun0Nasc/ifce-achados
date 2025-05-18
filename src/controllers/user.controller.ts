// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService, RegisterUserDto } from '../services/user.service';

const userService = new UserService();

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData: RegisterUserDto = req.body;

        const newUser = await userService.register(userData);

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: newUser
        });
    } catch (error) {
        next(error);
    }
};
