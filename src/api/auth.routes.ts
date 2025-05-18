import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/registro', userController.registerUser);

export default router;