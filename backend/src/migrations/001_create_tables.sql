-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(8) UNIQUE NOT NULL,
  nombre_completo VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_dni_length CHECK (LENGTH(dni) = 8)
);

-- Crear tabla de préstamos
CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  fecha_entrega TIMESTAMP NOT NULL,
  monto_principal DECIMAL(10, 2) NOT NULL,
  interes_anual_porcentaje DECIMAL(5, 2) NOT NULL,
  plazo_en_dias INTEGER NOT NULL,
  cuota_fija DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_monto_positivo CHECK (monto_principal > 0),
  CONSTRAINT check_interes_valid CHECK (interes_anual_porcentaje >= 0 AND interes_anual_porcentaje <= 100),
  CONSTRAINT check_plazo_multiplo_30 CHECK (plazo_en_dias % 30 = 0 AND plazo_en_dias > 0)
);

-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  numero_cuota INTEGER NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  interes_periodo DECIMAL(10, 2) NOT NULL,
  capital_amortizado DECIMAL(10, 2) NOT NULL,
  cuota_total DECIMAL(10, 2) NOT NULL,
  saldo_restante DECIMAL(10, 2) NOT NULL,
  pagado BOOLEAN DEFAULT FALSE,
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_loan_cuota UNIQUE (loan_id, numero_cuota)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clients_dni ON clients(dni);
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_loan_id ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_pagado ON payments(pagado);
