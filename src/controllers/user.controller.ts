// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService, RegisterUserDto } from '../services/user.service';
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";
import config from "../config";

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

//confirmação de email
export const confirmEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res
      .status(400)
      .json({ message: "Token de confirmação não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (user.isActive) {
      return res.status(200).json({ message: "Conta já confirmada." });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "E-mail confirmado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
};