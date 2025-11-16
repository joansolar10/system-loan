import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    const { token, admin } = response.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));

    return response.data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};
