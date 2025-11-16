import pool from '../config/database';
import { Admin } from '../types';

export class AdminModel {
  static async findByEmail(email: string): Promise<Admin | null> {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async create(email: string, passwordHash: string): Promise<Admin> {
    const result = await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Admin | null> {
    const result = await pool.query(
      'SELECT * FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}
