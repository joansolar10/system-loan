import api from './api';
import { Loan, Payment } from '../types';

export const loanService = {
  async create(data: {
    client_id: number;
    monto_principal: number;
    interes_anual_porcentaje: number;
    plazo_en_dias: number;
  }) {
    const response = await api.post('/loans', data);
    return response.data.data;
  },

  async getAll(): Promise<Loan[]> {
    const response = await api.get('/loans');
    return response.data.data;
  },

  async getById(id: number): Promise<Loan> {
    const response = await api.get(`/loans/${id}`);
    return response.data.data;
  },

  async getPayments(id: number): Promise<Payment[]> {
    const response = await api.get(`/loans/${id}/payments`);
    return response.data.data;
  },

  async downloadDDJJ(id: number) {
    const response = await api.get(`/loans/${id}/ddjj`, {
      responseType: 'blob',
    });

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DDJJ-Prestamo-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
