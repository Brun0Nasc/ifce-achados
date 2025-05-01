// src/api/auth.routes.ts
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
// Poderíamos adicionar validação de entrada aqui com middlewares

const router = Router();

// Rota POST para registrar um novo usuário
router.post('/register', authController.register);

// Rota POST para login (obter token JWT)
router.post('/login', authController.login);

// Poderia ter uma rota GET /me para buscar dados do usuário logado (usando o token)
// Ex: router.get('/me', authMiddleware, authController.getMe); // authMiddleware será criado no passo 5

export default router;