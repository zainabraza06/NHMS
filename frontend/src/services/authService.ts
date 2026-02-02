import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      credentials
    );
    return data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH_REGISTER,
      data
    );
    return response.data;
  },

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.AUTH_VERIFY_EMAIL}?token=${token}`
    );
    return data;
  },

  async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH_REQUEST_PASSWORD_RESET,
      { email }
    );
    return data;
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<ApiResponse<any>> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH_RESET_PASSWORD,
      { token, password }
    );
    return data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
};
