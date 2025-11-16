import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /auth/login - Iniciar sesión
router.post('/login', authLimiter, AuthController.login);

// GET /auth/verify - Verificar token
router.get('/verify', authMiddleware, AuthController.verify);

export default router;
