import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';
import { env } from '../config/env';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(adminId: number, email: string): string {
    return jwt.sign(
      { id: adminId, email },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.jwt.secret);
    } catch (error) {
      return null;
    }
  }

  static async login(email: string, password: string): Promise<{ token: string; admin: any } | null> {
    const admin = await AdminModel.findByEmail(email);

    if (!admin) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, admin.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const token = this.generateToken(admin.id, admin.email);

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }
}
