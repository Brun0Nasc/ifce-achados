// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from "express";
import { UserService, RegisterUserDto } from "../services/user.service";
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";
import config from "../config";

const userService = new UserService();

//cadastro user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.info("[CADASTRO] Iniciando registro de usuário...");
    const userData: RegisterUserDto = req.body;

    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.matricula ||
      !userData.instituicao
    ) {
      console.warn("[CADASTRO] Dados incompletos no payload:", userData);
      res.status(400).json({ message: "Dados obrigatórios não fornecidos." });
      return;
    }

    const newUser = await userService.register(userData);

    console.info(`[CADASTRO] Usuário registrado: ${newUser.email}`);
    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error("[ERRO][CADASTRO] Falha ao registrar usuário:", error);
    next(error); // pode ser um middleware de erro global
  }
};

//confirmação de email
export const confirmEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.query.token as string;

  if (!token) {
    console.warn("[CONFIRMAÇÃO] Token não fornecido na URL.");
    return res
      .status(400)
      .json({ message: "Token de confirmação não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      console.warn(
        `[CONFIRMAÇÃO] Usuário com ID ${decoded.userId} não encontrado.`
      );
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (user.isActive) {
      console.info(
        `[CONFIRMAÇÃO] Usuário ${user.email} já tinha confirmado a conta.`
      );
      return res.status(200).json({ message: "Conta já confirmada." });
    }

    user.isActive = true;
    await user.save();

    console.info(
      `[CONFIRMAÇÃO] E-mail de ${user.email} confirmado com sucesso.`
    );
    return res.status(200).json({ message: "E-mail confirmado com sucesso!" });
  } catch (err) {
    console.error("[ERRO][CONFIRMAÇÃO] Token inválido ou expirado:", err);
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
};
