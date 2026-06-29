import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<Usuario>('/auth/register', data).then((r) => r.data),

  me: () => apiClient.get<Usuario>('/auth/me').then((r) => r.data),
};
