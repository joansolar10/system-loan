export interface Admin {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Client {
  id: number;
  dni: string;
  nombre_completo: string;
  created_at: Date;
}

export interface Loan {
  id: number;
  client_id: number;
  fecha_entrega: Date;
  monto_principal: number;
  interes_anual_porcentaje: number;
  plazo_en_dias: number;
  cuota_fija: number;
  created_at: Date;
}

export interface Payment {
  id: number;
  loan_id: number;
  numero_cuota: number;
  fecha_vencimiento: Date;
  interes_periodo: number;
  capital_amortizado: number;
  cuota_total: number;
  saldo_restante: number;
  pagado: boolean;
  fecha_pago?: Date;
}

export interface AmortizationSchedule {
  numero_cuota: number;
  fecha_vencimiento: Date;
  interes_periodo: number;
  capital_amortizado: number;
  cuota_total: number;
  saldo_restante: number;
}

export interface LoanCalculationParams {
  monto_principal: number;
  interes_anual_porcentaje: number;
  plazo_en_dias: number;
  fecha_entrega: Date;
}

export interface ReniecResponse {
  dni: string;
  nombre_completo: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
}
