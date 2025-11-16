import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 solicitudes
  message: {
    success: false,
    error: 'Demasiados intentos de inicio de sesión, por favor intente más tarde.',
  },
  skipSuccessfulRequests: true,
});
