import axios, { AxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/domain';

const baseURL = import.meta.env.VITE_API_URL ?? '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'prode_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Mensaje de error legible extraído de la respuesta uniforme del GlobalExceptionHandler. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const body = axiosError.response?.data;
    if (body?.message) return body.message;
    if (axiosError.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Verificá tu conexión.';
    }
    if (axiosError.response?.status === 401) {
      return 'Tu sesión expiró. Volvé a iniciar sesión.';
    }
    return axiosError.message ?? 'Ocurrió un error inesperado.';
  }
  return 'Ocurrió un error inesperado.';
}

// Si el server responde 401 en cualquier momento (token vencido/inválido),
// limpiamos la sesión local y forzamos vuelta al login.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);
