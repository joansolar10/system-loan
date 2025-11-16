import axios from 'axios';
import NodeCache from 'node-cache';
import { env } from '../config/env';
import { ReniecResponse } from '../types';
import { validateDNI } from '../utils/validators';

const cache = new NodeCache({ stdTTL: env.cache.ttl });

// Mock data para fallback
const mockData: { [key: string]: string } = {
  '12345678': 'Juan Pérez García',
  '87654321': 'María López Rodríguez',
  '11111111': 'Carlos Sánchez Mendoza',
  '22222222': 'Ana Torres Vásquez',
};

export class ReniecService {
  private static requestCount = 0;
  private static lastResetTime = Date.now();

  static async consultarDNI(dni: string): Promise<ReniecResponse | null> {
    // Validar formato DNI
    if (!validateDNI(dni)) {
      throw new Error('DNI inválido. Debe contener exactamente 8 dígitos.');
    }

    // Verificar rate limit
    this.checkRateLimit();

    // Verificar cache
    const cachedResult = cache.get<ReniecResponse>(dni);
    if (cachedResult) {
      console.log(`✅ DNI ${dni} obtenido desde cache`);
      return cachedResult;
    }

    try {
      // Intentar consultar API real de RENIEC
      const response = await this.consultarAPIReal(dni);

      if (response) {
        cache.set(dni, response);
        return response;
      }
    } catch (error) {
      console.warn(`⚠️  API RENIEC no disponible, usando fallback para DNI ${dni}`);
    }

    // Fallback a mock data
    return this.consultarMockData(dni);
  }

  private static async consultarAPIReal(dni: string): Promise<ReniecResponse | null> {
    if (!env.reniec.apiToken) {
      throw new Error('RENIEC_API_TOKEN no configurado');
    }

    try {
      const response = await axios.get(`${env.reniec.apiUrl}?numero=${dni}`, {
        headers: {
          'Authorization': `Bearer ${env.reniec.apiToken}`,
        },
        timeout: 5000,
      });

      if (response.data && response.data.success) {
        const data = response.data.data;
        return {
          dni: dni,
          nombre_completo: `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`,
          nombres: data.nombres,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
        };
      }

      return null;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout al consultar RENIEC');
      }
      throw error;
    }
  }

  private static consultarMockData(dni: string): ReniecResponse | null {
    const nombreCompleto = mockData[dni];

    if (nombreCompleto) {
      const result: ReniecResponse = {
        dni,
        nombre_completo: nombreCompleto,
      };
      cache.set(dni, result);
      return result;
    }

    // Si no existe en mock, generar nombre genérico
    const result: ReniecResponse = {
      dni,
      nombre_completo: `Persona con DNI ${dni}`,
    };
    cache.set(dni, result);
    return result;
  }

  private static checkRateLimit(): void {
    const now = Date.now();
    const elapsed = now - this.lastResetTime;

    // Resetear contador cada ventana de tiempo
    if (elapsed >= env.rateLimit.windowMs) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    // Verificar límite
    if (this.requestCount >= env.rateLimit.maxRequests) {
      throw new Error('Rate limit excedido para consultas RENIEC. Intente más tarde.');
    }

    this.requestCount++;
  }

  static clearCache(): void {
    cache.flushAll();
  }

  static getCacheStats(): any {
    return cache.getStats();
  }
}
