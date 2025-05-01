import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel, { IUser } from '../models/User.model';

export interface IAuthenticatedRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    userId: string;
    role?: string;
}

export const protect = async (req: IAuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

            req.user = await UserModel.findById(decoded.userId).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'Usuário não encontrado.' });
            }

            next();

        } catch (error) {
            console.error('Erro na verificação do token:', error);

            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                 return res.status(401).json({ message: 'Token inválido.' });
            }
             
            return res.status(401).json({ message: 'Não autorizado.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, token não fornecido.' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
             return res.status(403).json({ message: 'Acesso negado. Perfil não autorizado.' });
        }
        next();
    };
};