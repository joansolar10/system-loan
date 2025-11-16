import { AmortizationSchedule, LoanCalculationParams } from '../types';

export class AmortizationService {
  /**
   * Calcula la cuota fija usando el sistema francés
   * Fórmula: C = P * [r / (1 - (1 + r)^-n)]
   *
   * @param montoPrincipal - Monto del préstamo
   * @param tasaInteresAnual - Tasa de interés anual en porcentaje (ej: 12 para 12%)
   * @param plazoEnDias - Plazo total en días (debe ser múltiplo de 30)
   * @returns Cuota fija mensual
   */
  static calcularCuotaFija(
    montoPrincipal: number,
    tasaInteresAnual: number,
    plazoEnDias: number
  ): number {
    // Validar que el plazo sea múltiplo de 30
    if (plazoEnDias % 30 !== 0) {
      throw new Error('El plazo debe ser múltiplo de 30 días');
    }

    const numeroCuotas = plazoEnDias / 30;

    // Calcular tasa de interés por período (30 días)
    // i_periodo = (tasa_anual / 100) * (30 / 365)
    const tasaPorPeriodo = (tasaInteresAnual / 100) * (30 / 365);

    // Si la tasa es 0, la cuota es simplemente el capital dividido por el número de cuotas
    if (tasaPorPeriodo === 0) {
      return montoPrincipal / numeroCuotas;
    }

    // Fórmula del sistema francés: C = P * [r / (1 - (1 + r)^-n)]
    const cuotaFija =
      montoPrincipal *
      (tasaPorPeriodo / (1 - Math.pow(1 + tasaPorPeriodo, -numeroCuotas)));

    return Math.round(cuotaFija * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Genera el cronograma de amortización completo
   *
   * @param params - Parámetros del préstamo
   * @returns Array con el cronograma de amortización
   */
  static generarCronograma(params: LoanCalculationParams): AmortizationSchedule[] {
    const { monto_principal, interes_anual_porcentaje, plazo_en_dias, fecha_entrega } = params;

    const numeroCuotas = plazo_en_dias / 30;
    const tasaPorPeriodo = (interes_anual_porcentaje / 100) * (30 / 365);
    const cuotaFija = this.calcularCuotaFija(monto_principal, interes_anual_porcentaje, plazo_en_dias);

    const cronograma: AmortizationSchedule[] = [];
    let saldoRestante = monto_principal;

    for (let i = 1; i <= numeroCuotas; i++) {
      // Calcular fecha de vencimiento (fecha_entrega + i * 30 días)
      const fechaVencimiento = new Date(fecha_entrega);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + i * 30);

      // Calcular interés del período
      const interesPeriodo = Math.round(saldoRestante * tasaPorPeriodo * 100) / 100;

      // Calcular capital amortizado
      let capitalAmortizado = cuotaFija - interesPeriodo;

      // En la última cuota, ajustar para cerrar el préstamo exactamente
      if (i === numeroCuotas) {
        capitalAmortizado = saldoRestante;
      }

      capitalAmortizado = Math.round(capitalAmortizado * 100) / 100;

      // Actualizar saldo restante
      const nuevoSaldo = Math.max(0, saldoRestante - capitalAmortizado);

      // Calcular cuota total (en la última puede ser diferente por ajustes)
      const cuotaTotal = Math.round((interesPeriodo + capitalAmortizado) * 100) / 100;

      cronograma.push({
        numero_cuota: i,
        fecha_vencimiento: fechaVencimiento,
        interes_periodo: interesPeriodo,
        capital_amortizado: capitalAmortizado,
        cuota_total: cuotaTotal,
        saldo_restante: Math.round(nuevoSaldo * 100) / 100,
      });

      saldoRestante = nuevoSaldo;
    }

    return cronograma;
  }

  /**
   * Valida los parámetros del préstamo
   */
  static validarParametros(params: LoanCalculationParams): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.monto_principal <= 0) {
      errors.push('El monto principal debe ser mayor a 0');
    }

    if (params.interes_anual_porcentaje < 0) {
      errors.push('El interés anual no puede ser negativo');
    }

    if (params.interes_anual_porcentaje > 100) {
      errors.push('El interés anual no puede ser mayor a 100%');
    }

    if (params.plazo_en_dias <= 0) {
      errors.push('El plazo debe ser mayor a 0');
    }

    if (params.plazo_en_dias % 30 !== 0) {
      errors.push('El plazo debe ser múltiplo de 30 días');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
