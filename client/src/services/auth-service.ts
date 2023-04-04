import httpApi from '../http/index.js';
import type { AxiosResponse } from 'axios';
import type { AuthResponse } from '../models/response/auth-response';

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return await httpApi.post('/login', { email, password });
  }

  static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return await httpApi.post('/registration', { email, password });
  }

  static async refresh(): Promise<AxiosResponse<AuthResponse>> {
    return await httpApi.get('/refresh');
  }

  static async logout(): Promise<void> {
    return await httpApi.post('/logout');
  }
}
