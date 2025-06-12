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

export const protect = async (req: IAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

            req.user = await UserModel.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.status(401).json({ message: 'Usuário não encontrado.' });
                return;
            }

            next();

        } catch (error) {
            console.error('Erro na verificação do token:', error);

            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
                return;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                 res.status(401).json({ message: 'Token inválido.' });
                return;
            }
             
            res.status(401).json({ message: 'Não autorizado.' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, token não fornecido.' });
        return;
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