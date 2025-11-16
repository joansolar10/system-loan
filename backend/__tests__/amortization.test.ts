import { AmortizationService } from '../src/services/amortizationService';

describe('AmortizationService', () => {
  describe('calcularCuotaFija', () => {
    it('debe calcular correctamente la cuota fija para un préstamo estándar', () => {
      const montoPrincipal = 10000;
      const tasaInteresAnual = 12; // 12%
      const plazoEnDias = 360; // 12 meses

      const cuotaFija = AmortizationService.calcularCuotaFija(
        montoPrincipal,
        tasaInteresAnual,
        plazoEnDias
      );

      // La cuota debería estar entre 850 y 900 soles aproximadamente
      expect(cuotaFija).toBeGreaterThan(850);
      expect(cuotaFija).toBeLessThan(900);
    });

    it('debe calcular correctamente con tasa de interés 0%', () => {
      const montoPrincipal = 12000;
      const tasaInteresAnual = 0;
      const plazoEnDias = 360; // 12 meses

      const cuotaFija = AmortizationService.calcularCuotaFija(
        montoPrincipal,
        tasaInteresAnual,
        plazoEnDias
      );

      // Con 0% de interés, la cuota es capital / número de cuotas
      expect(cuotaFija).toBe(1000); // 12000 / 12
    });

    it('debe lanzar error si el plazo no es múltiplo de 30', () => {
      expect(() => {
        AmortizationService.calcularCuotaFija(10000, 12, 45);
      }).toThrow('El plazo debe ser múltiplo de 30 días');
    });

    it('debe calcular correctamente para diferentes tasas', () => {
      const montoPrincipal = 5000;
      const plazoEnDias = 180; // 6 meses

      const cuota10 = AmortizationService.calcularCuotaFija(montoPrincipal, 10, plazoEnDias);
      const cuota20 = AmortizationService.calcularCuotaFija(montoPrincipal, 20, plazoEnDias);

      // Mayor tasa debe generar mayor cuota
      expect(cuota20).toBeGreaterThan(cuota10);
    });
  });

  describe('generarCronograma', () => {
    it('debe generar el número correcto de cuotas', () => {
      const fechaEntrega = new Date('2024-01-01');
      const cronograma = AmortizationService.generarCronograma({
        monto_principal: 10000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 180, // 6 meses
        fecha_entrega: fechaEntrega,
      });

      expect(cronograma).toHaveLength(6);
    });

    it('debe tener saldo restante 0 en la última cuota', () => {
      const fechaEntrega = new Date('2024-01-01');
      const cronograma = AmortizationService.generarCronograma({
        monto_principal: 10000,
        interes_anual_porcentaje: 15,
        plazo_en_dias: 360,
        fecha_entrega: fechaEntrega,
      });

      const ultimaCuota = cronograma[cronograma.length - 1];
      expect(ultimaCuota.saldo_restante).toBe(0);
    });

    it('debe incrementar las fechas de vencimiento en 30 días', () => {
      const fechaEntrega = new Date('2024-01-01');
      const cronograma = AmortizationService.generarCronograma({
        monto_principal: 6000,
        interes_anual_porcentaje: 10,
        plazo_en_dias: 90,
        fecha_entrega: fechaEntrega,
      });

      expect(cronograma[0].fecha_vencimiento).toEqual(new Date('2024-01-31'));
      expect(cronograma[1].fecha_vencimiento).toEqual(new Date('2024-03-01')); // 2024 es bisiesto
      expect(cronograma[2].fecha_vencimiento).toEqual(new Date('2024-03-31'));
    });

    it('debe tener intereses decrecientes y capital creciente', () => {
      const fechaEntrega = new Date('2024-01-01');
      const cronograma = AmortizationService.generarCronograma({
        monto_principal: 10000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 180,
        fecha_entrega: fechaEntrega,
      });

      // Primera cuota vs última cuota
      const primeraCuota = cronograma[0];
      const ultimaCuota = cronograma[cronograma.length - 1];

      // El interés debe decrecer
      expect(ultimaCuota.interes_periodo).toBeLessThan(primeraCuota.interes_periodo);

      // El capital amortizado debe crecer
      expect(ultimaCuota.capital_amortizado).toBeGreaterThan(primeraCuota.capital_amortizado);
    });

    it('debe sumar correctamente el capital amortizado al monto principal', () => {
      const montoPrincipal = 8000;
      const fechaEntrega = new Date('2024-01-01');

      const cronograma = AmortizationService.generarCronograma({
        monto_principal: montoPrincipal,
        interes_anual_porcentaje: 15,
        plazo_en_dias: 240,
        fecha_entrega: fechaEntrega,
      });

      const totalCapital = cronograma.reduce(
        (sum, cuota) => sum + cuota.capital_amortizado,
        0
      );

      // El total del capital amortizado debe ser igual al monto principal
      expect(Math.round(totalCapital)).toBe(montoPrincipal);
    });

    it('debe validar correctamente los parámetros', () => {
      const fechaEntrega = new Date('2024-01-01');

      const validation1 = AmortizationService.validarParametros({
        monto_principal: -1000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 180,
        fecha_entrega: fechaEntrega,
      });

      expect(validation1.valid).toBe(false);
      expect(validation1.errors).toContain('El monto principal debe ser mayor a 0');

      const validation2 = AmortizationService.validarParametros({
        monto_principal: 10000,
        interes_anual_porcentaje: 150,
        plazo_en_dias: 180,
        fecha_entrega: fechaEntrega,
      });

      expect(validation2.valid).toBe(false);
      expect(validation2.errors).toContain('El interés anual no puede ser mayor a 100%');

      const validation3 = AmortizationService.validarParametros({
        monto_principal: 10000,
        interes_anual_porcentaje: 12,
        plazo_en_dias: 45,
        fecha_entrega: fechaEntrega,
      });

      expect(validation3.valid).toBe(false);
      expect(validation3.errors).toContain('El plazo debe ser múltiplo de 30 días');
    });
  });
});
