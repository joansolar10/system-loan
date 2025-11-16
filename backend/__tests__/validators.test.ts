import { validateDNI, loginSchema, clientSchema, loanSchema } from '../src/utils/validators';

describe('Validators', () => {
  describe('validateDNI', () => {
    it('debe validar DNI correcto de 8 dígitos', () => {
      expect(validateDNI('12345678')).toBe(true);
      expect(validateDNI('87654321')).toBe(true);
    });

    it('debe rechazar DNI con menos de 8 dígitos', () => {
      expect(validateDNI('1234567')).toBe(false);
    });

    it('debe rechazar DNI con más de 8 dígitos', () => {
      expect(validateDNI('123456789')).toBe(false);
    });

    it('debe rechazar DNI con caracteres no numéricos', () => {
      expect(validateDNI('1234567a')).toBe(false);
      expect(validateDNI('abcd1234')).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('debe validar email y password correctos', () => {
      const { error } = loginSchema.validate({
        email: 'admin@loans.com',
        password: 'password123',
      });

      expect(error).toBeUndefined();
    });

    it('debe rechazar email inválido', () => {
      const { error } = loginSchema.validate({
        email: 'not-an-email',
        password: 'password123',
      });

      expect(error).toBeDefined();
    });

    it('debe rechazar password muy corto', () => {
      const { error } = loginSchema.validate({
        email: 'admin@loans.com',
        password: '12345',
      });

      expect(error).toBeDefined();
    });
  });

  describe('clientSchema', () => {
    it('debe validar cliente con DNI válido', () => {
      const { error } = clientSchema.validate({
        dni: '12345678',
        nombre_completo: 'Juan Pérez',
      });

      expect(error).toBeUndefined();
    });

    it('debe rechazar DNI inválido', () => {
      const { error } = clientSchema.validate({
        dni: '123',
        nombre_completo: 'Juan Pérez',
      });

      expect(error).toBeDefined();
    });
  });

  describe('loanSchema', () => {
    it('debe validar préstamo válido', () => {
      const { error } = loanSchema.validate({
        client_id: 1,
        monto_principal: 10000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 360,
      });

      expect(error).toBeUndefined();
    });

    it('debe rechazar monto negativo', () => {
      const { error } = loanSchema.validate({
        client_id: 1,
        monto_principal: -1000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 360,
      });

      expect(error).toBeDefined();
    });

    it('debe rechazar plazo no múltiplo de 30', () => {
      const { error } = loanSchema.validate({
        client_id: 1,
        monto_principal: 10000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 45,
      });

      expect(error).toBeDefined();
    });

    it('debe rechazar interés mayor a 100%', () => {
      const { error } = loanSchema.validate({
        client_id: 1,
        monto_principal: 10000,
        interes_anual_porcentaje: 150,
        plazo_en_dias: 360,
      });

      expect(error).toBeDefined();
    });
  });
});
