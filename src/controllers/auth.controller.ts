import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import config from "../config";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  try {
    console.log("Procurando usuário pelo email:", email);
    const user = await UserModel.findOne({ email }).select("+password");
    console.log("Usuário encontrado:", user);

    if (!user) {
      console.log("Usuário não encontrado.");
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }
    const isMatch = await user.comparePassword(password);
    console.log("Senha confere?", isMatch);
    if (!isMatch) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };
    if (!config.jwt.secret) {
      console.error("JWT secret não definido!");
      res.status(500).json({ message: "Configuração JWT inválida." });
      return;
    }

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res
      .status(500)
      .json({ message: "Erro interno no servidor durante o login." });
  }
};
