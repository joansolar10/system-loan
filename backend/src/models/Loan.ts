import pool from '../config/database';
import { Loan } from '../types';

export class LoanModel {
  static async create(
    clientId: number,
    fechaEntrega: Date,
    montoPrincipal: number,
    interesAnualPorcentaje: number,
    plazoEnDias: number,
    cuotaFija: number
  ): Promise<Loan> {
    const result = await pool.query(
      `INSERT INTO loans
       (client_id, fecha_entrega, monto_principal, interes_anual_porcentaje, plazo_en_dias, cuota_fija)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [clientId, fechaEntrega, montoPrincipal, interesAnualPorcentaje, plazoEnDias, cuotaFija]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Loan | null> {
    const result = await pool.query(
      'SELECT * FROM loans WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByClientId(clientId: number): Promise<Loan[]> {
    const result = await pool.query(
      'SELECT * FROM loans WHERE client_id = $1 ORDER BY created_at DESC',
      [clientId]
    );
    return result.rows;
  }

  static async findAll(): Promise<Loan[]> {
    const result = await pool.query(
      `SELECT l.*, c.dni, c.nombre_completo
       FROM loans l
       JOIN clients c ON l.client_id = c.id
       ORDER BY l.created_at DESC`
    );
    return result.rows;
  }

  static async findWithClient(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT l.*, c.dni, c.nombre_completo
       FROM loans l
       JOIN clients c ON l.client_id = c.id
       WHERE l.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
