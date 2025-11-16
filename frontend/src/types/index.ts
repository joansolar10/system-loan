export interface Admin {
  id: number;
  email: string;
}

export interface Client {
  id: number;
  dni: string;
  nombre_completo: string;
  created_at: string;
}

export interface Loan {
  id: number;
  client_id: number;
  fecha_entrega: string;
  monto_principal: number | string;
  interes_anual_porcentaje: number | string;
  plazo_en_dias: number;
  cuota_fija: number | string;
  created_at: string;
  dni?: string;
  nombre_completo?: string;
}

export interface Payment {
  id: number;
  loan_id: number;
  numero_cuota: number;
  fecha_vencimiento: string;
  interes_periodo: number | string;
  capital_amortizado: number | string;
  cuota_total: number | string;
  saldo_restante: number | string;
  pagado: boolean;
  fecha_pago?: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}
