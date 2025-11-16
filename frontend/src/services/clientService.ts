import api from './api';
import { Client } from '../types';

export const clientService = {
  async getByDNI(dni: string) {
    const response = await api.get(`/clients/${dni}`);
    return response.data;
  },

  async create(dni: string, nombreCompleto: string): Promise<Client> {
    const response = await api.post('/clients', {
      dni,
      nombre_completo: nombreCompleto,
    });
    return response.data.data;
  },

  async getAll(): Promise<Client[]> {
    const response = await api.get('/clients');
    return response.data.data;
  },
};
