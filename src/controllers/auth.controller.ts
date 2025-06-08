// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import config from "../config";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.warn("[LOGIN] Email e senha não foram fornecidos.");
    res.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  try {
    console.info(`[LOGIN] Tentativa de login para: ${email}`);
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      console.warn(`[LOGIN] Usuário com email ${email} não encontrado.`);
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`[LOGIN] Senha incorreta para o usuário: ${email}`);
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    if (!user.isActive) {
      console.warn(`[LOGIN] Conta inativa para o usuário: ${email}`);
      res
        .status(403)
        .json({ message: "Conta não confirmada. Verifique seu e-mail." });
      return;
    }

    if (!config.jwt.secret) {
      console.error("[LOGIN] JWT secret não está definida!");
      res.status(500).json({ message: "Erro interno de configuração JWT." });
      return;
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn || "1h",
    });

    console.info(`[LOGIN] Login bem-sucedido para ${email}`);

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[ERRO][LOGIN] Falha no processo de login:", error);
    res
      .status(500)
      .json({ message: "Erro interno no servidor durante o login." });
  }
};
