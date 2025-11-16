import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Error de autenticación',
    });
  }
};
