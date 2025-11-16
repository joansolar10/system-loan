import { Request, Response } from 'express';
import { ClientModel } from '../models/Client';
import { ReniecService } from '../services/reniecService';
import { clientSchema } from '../utils/validators';

export class ClientController {
  /**
   * GET /clients/:dni - Consulta cliente por DNI y autocompleta con RENIEC
   */
  static async getByDNI(req: Request, res: Response) {
    try {
      const { dni } = req.params;

      // Buscar cliente existente
      let client = await ClientModel.findByDNI(dni);

      if (client) {
        return res.json({
          success: true,
          data: client,
          source: 'database',
        });
      }

      // Si no existe, consultar RENIEC
      try {
        const reniecData = await ReniecService.consultarDNI(dni);

        if (reniecData) {
          return res.json({
            success: true,
            data: {
              dni: reniecData.dni,
              nombre_completo: reniecData.nombre_completo,
            },
            source: 'reniec',
          });
        }
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(404).json({
        success: false,
        error: 'DNI no encontrado',
      });
    } catch (error: any) {
      console.error('Error en getByDNI:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al consultar DNI',
      });
    }
  }

  /**
   * POST /clients - Crear nuevo cliente
   */
  static async create(req: Request, res: Response) {
    try {
      const { error } = clientSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message,
        });
      }

      const { dni, nombre_completo } = req.body;

      // Verificar si ya existe
      const existing = await ClientModel.findByDNI(dni);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Cliente ya existe',
        });
      }

      // Si no se proporciona nombre, consultar RENIEC
      let finalName = nombre_completo;
      if (!finalName) {
        const reniecData = await ReniecService.consultarDNI(dni);
        if (!reniecData) {
          return res.status(400).json({
            success: false,
            error: 'No se pudo obtener el nombre del cliente',
          });
        }
        finalName = reniecData.nombre_completo;
      }

      const client = await ClientModel.create(dni, finalName);

      return res.status(201).json({
        success: true,
        data: client,
      });
    } catch (error: any) {
      console.error('Error en create client:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error al crear cliente',
      });
    }
  }

  /**
   * GET /clients - Listar todos los clientes
   */
  static async getAll(req: Request, res: Response) {
    try {
      const clients = await ClientModel.findAll();

      return res.json({
        success: true,
        data: clients,
      });
    } catch (error: any) {
      console.error('Error en getAll clients:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener clientes',
      });
    }
  }
}
