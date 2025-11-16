import pool from '../config/database';
import { Client } from '../types';

export class ClientModel {
  static async findByDNI(dni: string): Promise<Client | null> {
    const result = await pool.query(
      'SELECT * FROM clients WHERE dni = $1',
      [dni]
    );
    return result.rows[0] || null;
  }

  static async create(dni: string, nombreCompleto: string): Promise<Client> {
    const result = await pool.query(
      'INSERT INTO clients (dni, nombre_completo) VALUES ($1, $2) RETURNING *',
      [dni, nombreCompleto]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Client | null> {
    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findAll(): Promise<Client[]> {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async update(id: number, nombreCompleto: string): Promise<Client | null> {
    const result = await pool.query(
      'UPDATE clients SET nombre_completo = $1 WHERE id = $2 RETURNING *',
      [nombreCompleto, id]
    );
    return result.rows[0] || null;
  }
}
