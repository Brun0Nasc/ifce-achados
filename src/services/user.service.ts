import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config";
import UserModel, { IUser } from "../models/User.model";

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  matricula: string;
  instituicao: string;
}

export interface RegisteredUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  matricula: string;
  instituicao: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export class UserService {
  public async register(userData: RegisterUserDto): Promise<RegisteredUser> {
    const { name, email, password, instituicao, matricula } = userData;

    console.info(`[REGISTER] Iniciando registro de usuário: ${email}`);

    // Verifica duplicidade por email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      console.warn(`[REGISTER] Email já cadastrado: ${email}`);
      throw new Error("Email já cadastrado.");
    }

    // Opcional: verifica duplicidade por matrícula
    const existingMatricula = await UserModel.findOne({ matricula });
    if (existingMatricula) {
      console.warn(`[REGISTER] Matrícula já cadastrada: ${matricula}`);
      throw new Error("Matrícula já cadastrada.");
    }

    const newUser = new UserModel({
      name,
      email,
      password,
      instituicao,
      matricula,
    });

    await newUser.save();
    console.info(`[REGISTER] Usuário criado com sucesso: ${email}`);

    // Gera token de confirmação
    const token = jwt.sign({ userId: newUser._id }, config.jwt.secret, {
      expiresIn: "1d",
    });

    const confirmBaseUrl = config.baseUrl || "http://localhost:3000";
    const confirmLink = `${confirmBaseUrl}/users/confirm?token=${token}`;
    console.info(`[REGISTER] Link de confirmação: ${confirmLink}`);

    // Aqui você chamaria um serviço de envio de e-mail futuramente
    // await EmailService.sendConfirmation(email, confirmLink);

    const userObject = newUser.toObject<IUser>();

    return {
      _id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      instituicao: userObject.instituicao,
      matricula: userObject.matricula,
      role: userObject.role,
      isActive: userObject.isActive,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
      lastLogin: userObject.lastLogin,
    };
  }
}
