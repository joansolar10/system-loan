import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { loginSchema } from '../utils/validators';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      // Validar entrada
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
      }

      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      if (!result) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
        });
      }

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error en login:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión',
      });
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      return res.json({
        success: true,
        data: {
          admin: req.body.admin,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Error al verificar token',
      });
    }
  }
}
