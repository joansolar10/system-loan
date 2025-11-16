import PDFDocument from 'pdfkit';
import { Loan, Client } from '../types';
import { env } from '../config/env';

export class PDFService {
  /**
   * Genera PDF de Declaración Jurada
   */
  static generarDeclaracionJurada(loan: Loan, client: Client): PDFDocument {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Verificar si requiere DDJJ
    const requiereDDJJ = this.requiereDeclaracionJurada(loan.monto_principal);

    if (!requiereDDJJ) {
      throw new Error('El monto del préstamo no requiere declaración jurada');
    }

    // Encabezado
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('DECLARACIÓN JURADA', { align: 'center' })
      .moveDown();

    doc
      .fontSize(16)
      .text('ORIGEN DE FONDOS', { align: 'center' })
      .moveDown(2);

    // Fecha
    const fecha = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Fecha: ${fecha}`, { align: 'right' })
      .moveDown(2);

    // Datos del cliente
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DATOS DEL SOLICITANTE')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Nombre Completo: ${client.nombre_completo}`)
      .text(`DNI: ${client.dni}`)
      .moveDown(2);

    // Datos del préstamo
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DATOS DEL PRÉSTAMO')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Monto Principal: S/ ${loan.monto_principal.toFixed(2)}`)
      .text(`Tasa de Interés Anual: ${loan.interes_anual_porcentaje}%`)
      .text(`Plazo: ${loan.plazo_en_dias} días`)
      .text(`Cuota Mensual: S/ ${loan.cuota_fija.toFixed(2)}`)
      .moveDown(2);

    // Declaración
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DECLARACIÓN')
      .moveDown(0.5);

    const declaracionTexto = `Yo, ${client.nombre_completo}, identificado con DNI N° ${client.dni}, declaro bajo juramento que:

1. Los fondos que utilizaré para el pago de las cuotas del préstamo solicitado provienen de fuentes lícitas.

2. No estoy incurso en ninguna actividad ilícita ni tengo relación con actividades de lavado de activos o financiamiento del terrorismo.

3. La información proporcionada en la presente declaración es verdadera y completa.

4. Me comprometo a notificar cualquier cambio en mi situación financiera que pueda afectar mi capacidad de pago.

5. Autorizo a la institución financiera a verificar la información proporcionada.`;

    doc
      .fontSize(11)
      .font('Helvetica')
      .text(declaracionTexto, { align: 'justify' })
      .moveDown(3);

    // Firma
    doc
      .fontSize(12)
      .text('_________________________________', { align: 'center' })
      .moveDown(0.5)
      .text('Firma del Solicitante', { align: 'center' })
      .moveDown(0.5)
      .text(`DNI: ${client.dni}`, { align: 'center' });

    // Pie de página
    doc
      .moveDown(3)
      .fontSize(9)
      .font('Helvetica-Oblique')
      .text(
        'Este documento constituye una declaración jurada de acuerdo a lo establecido en las normas vigentes sobre prevención de lavado de activos y financiamiento del terrorismo.',
        { align: 'justify' }
      );

    // Número de préstamo
    doc
      .moveDown(1)
      .fontSize(8)
      .text(`Préstamo N° ${loan.id} - Generado el ${fecha}`, { align: 'center' });

    return doc;
  }

  /**
   * Determina si un préstamo requiere declaración jurada basado en el monto
   */
  static requiereDeclaracionJurada(montoPrincipal: number): boolean {
    return montoPrincipal >= env.ddjj.threshold1;
  }

  /**
   * Obtiene el nivel de declaración requerido
   */
  static getNivelDeclaracion(montoPrincipal: number): string {
    if (montoPrincipal >= env.ddjj.threshold2) {
      return 'NIVEL_ALTO';
    } else if (montoPrincipal >= env.ddjj.threshold1) {
      return 'NIVEL_MEDIO';
    }
    return 'NO_REQUIERE';
  }
}
