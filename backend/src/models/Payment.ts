import pool from '../config/database';
import { Payment } from '../types';

export class PaymentModel {
  static async createBulk(payments: Omit<Payment, 'id'>[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const payment of payments) {
        await client.query(
          `INSERT INTO payments
           (loan_id, numero_cuota, fecha_vencimiento, interes_periodo, capital_amortizado, cuota_total, saldo_restante, pagado)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            payment.loan_id,
            payment.numero_cuota,
            payment.fecha_vencimiento,
            payment.interes_periodo,
            payment.capital_amortizado,
            payment.cuota_total,
            payment.saldo_restante,
            payment.pagado || false,
          ]
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async findByLoanId(loanId: number): Promise<Payment[]> {
    const result = await pool.query(
      'SELECT * FROM payments WHERE loan_id = $1 ORDER BY numero_cuota ASC',
      [loanId]
    );
    return result.rows;
  }

  static async markAsPaid(id: number, fechaPago?: Date): Promise<Payment | null> {
    const result = await pool.query(
      'UPDATE payments SET pagado = true, fecha_pago = $1 WHERE id = $2 RETURNING *',
      [fechaPago || new Date(), id]
    );
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<Payment | null> {
    const result = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}
