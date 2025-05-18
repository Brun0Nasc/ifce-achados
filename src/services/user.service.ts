import mongoose, { Types } from 'mongoose';
import UserModel, { IUser } from '../models/User.model'; // Seu User Model

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
    role: 'user' | 'admin' | 'moderator';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
}



export class UserService {
    public async register(userData: RegisterUserDto): Promise<RegisteredUser> {
        const { name, email, password, instituicao, matricula } = userData;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email já cadastrado.');
        }

        const newUserDocument = new UserModel({ name, email, password, instituicao, matricula });
        await newUserDocument.save();

        const userObject = newUserDocument.toObject<IUser>(); // Use <IUser> para melhor tipagem do toObject

        // A forma como você estava construindo o objeto já era boa para criar um POJO.
        // A questão era a definição do tipo RegisteredUser.
        const registeredUser: RegisteredUser = {
            _id: userObject._id, // _id vem do userObject
            name: userObject.name,
            email: userObject.email,
            instituicao: userObject.instituicao, 
            matricula: userObject.matricula,
            role: userObject.role,
            isActive: userObject.isActive,
            createdAt: userObject.createdAt, // Adicionado
            updatedAt: userObject.updatedAt, // Adicionado
            lastLogin: userObject.lastLogin, // Se existir
        };

        return registeredUser;
    }
}