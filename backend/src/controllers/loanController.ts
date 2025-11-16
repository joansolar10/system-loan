import { Request, Response } from 'express';
import { LoanModel } from '../models/Loan';
import { ClientModel } from '../models/Client';
import { PaymentModel } from '../models/Payment';
import { AmortizationService } from '../services/amortizationService';
import { PDFService } from '../services/pdfService';
import { loanSchema } from '../utils/validators';

export class LoanController {
  /**
   * POST /loans - Crear nuevo préstamo
   */
  static async create(req: Request, res: Response) {
    try {
      const { error } = loanSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
      }

      const { client_id, monto_principal, interes_anual_porcentaje, plazo_en_dias } = req.body;

      // Verificar que el cliente existe
      const client = await ClientModel.findById(client_id);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado',
        });
      }

      // Calcular cuota fija
      const cuotaFija = AmortizationService.calcularCuotaFija(
        monto_principal,
        interes_anual_porcentaje,
        plazo_en_dias
      );

      // Crear préstamo
      const fechaEntrega = new Date();
      const loan = await LoanModel.create(
        client_id,
        fechaEntrega,
        monto_principal,
        interes_anual_porcentaje,
        plazo_en_dias,
        cuotaFija
      );

      // Generar cronograma de pagos
      const cronograma = AmortizationService.generarCronograma({
        monto_principal,
        interes_anual_porcentaje,
        plazo_en_dias,
        fecha_entrega: fechaEntrega,
      });

      // Guardar pagos en la base de datos
      const payments = cronograma.map((item) => ({
        loan_id: loan.id,
        numero_cuota: item.numero_cuota,
        fecha_vencimiento: item.fecha_vencimiento,
        interes_periodo: item.interes_periodo,
        capital_amortizado: item.capital_amortizado,
        cuota_total: item.cuota_total,
        saldo_restante: item.saldo_restante,
        pagado: false,
      }));

      await PaymentModel.createBulk(payments);

      return res.status(201).json({
        success: true,
        data: {
          loan,
          cronograma,
          requiere_ddjj: PDFService.requiereDeclaracionJurada(monto_principal),
        },
      });
    } catch (error: any) {
      console.error('Error en create loan:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error al crear préstamo',
      });
    }
  }

  /**
   * GET /loans - Listar todos los préstamos
   */
  static async getAll(req: Request, res: Response) {
    try {
      const loans = await LoanModel.findAll();

      return res.json({
        success: true,
        data: loans,
      });
    } catch (error: any) {
      console.error('Error en getAll loans:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener préstamos',
      });
    }
  }

  /**
   * GET /loans/:id - Obtener préstamo por ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const loan = await LoanModel.findWithClient(parseInt(id));

      if (!loan) {
        return res.status(404).json({
          success: false,
          error: 'Préstamo no encontrado',
        });
      }

      return res.json({
        success: true,
        data: loan,
      });
    } catch (error: any) {
      console.error('Error en getById loan:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener préstamo',
      });
    }
  }

  /**
   * GET /loans/:id/payments - Obtener cronograma de pagos
   */
  static async getPayments(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const loan = await LoanModel.findById(parseInt(id));
      if (!loan) {
        return res.status(404).json({
          success: false,
          error: 'Préstamo no encontrado',
        });
      }

      const payments = await PaymentModel.findByLoanId(parseInt(id));

      return res.json({
        success: true,
        data: payments,
      });
    } catch (error: any) {
      console.error('Error en getPayments:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener pagos',
      });
    }
  }

  /**
   * GET /loans/:id/ddjj - Generar PDF de declaración jurada
   */
  static async generateDDJJ(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const loan = await LoanModel.findById(parseInt(id));
      if (!loan) {
        return res.status(404).json({
          success: false,
          error: 'Préstamo no encontrado',
        });
      }

      const client = await ClientModel.findById(loan.client_id);
      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado',
        });
      }

      // Verificar si requiere DDJJ
      if (!PDFService.requiereDeclaracionJurada(loan.monto_principal)) {
        return res.status(400).json({
          success: false,
          error: 'Este préstamo no requiere declaración jurada',
        });
      }

      // Generar PDF
      const doc = PDFService.generarDeclaracionJurada(loan, client);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=DDJJ-Prestamo-${loan.id}-${client.dni}.pdf`
      );

      // Enviar PDF
      doc.pipe(res);
      doc.end();
    } catch (error: any) {
      console.error('Error en generateDDJJ:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error al generar declaración jurada',
      });
    }
  }
}
