import Joi from 'joi';

export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const clientSchema = Joi.object({
  dni: Joi.string().pattern(/^\d{8}$/).required().messages({
    'string.pattern.base': 'DNI debe tener exactamente 8 dígitos',
  }),
  nombre_completo: Joi.string().min(3).max(200).optional(),
});

export const loanSchema = Joi.object({
  client_id: Joi.number().integer().positive().required(),
  monto_principal: Joi.number().positive().required().messages({
    'number.positive': 'El monto principal debe ser positivo',
  }),
  interes_anual_porcentaje: Joi.number().min(0).max(100).required().messages({
    'number.min': 'El interés anual no puede ser negativo',
    'number.max': 'El interés anual no puede ser mayor a 100%',
  }),
  plazo_en_dias: Joi.number().positive().custom((value, helpers) => {
    if (value % 30 !== 0) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'any.invalid': 'El plazo debe ser múltiplo de 30 días',
  }),
});

export const paymentSchema = Joi.object({
  loan_id: Joi.number().integer().positive().required(),
  numero_cuota: Joi.number().integer().positive().required(),
  fecha_pago: Joi.date().optional(),
});
