import { apiClient } from './client';

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  idGrupoPropio: number | null;
  activo: boolean;
}

export interface UsuarioUpdateRequest {
  nombreUsuario: string;
  email: string;
}

export const usuariosApi = {
  listar: () => apiClient.get<UsuarioResponse[]>('/usuarios').then((r) => r.data),

  obtenerMe: () => apiClient.get<UsuarioResponse>('/auth/me').then((r) => r.data),

  actualizar: (id: number, data: UsuarioUpdateRequest) =>
    apiClient.put<UsuarioResponse>(`/usuarios/${id}`, data).then((r) => r.data),

  eliminar: (id: number) => apiClient.delete<void>(`/usuarios/${id}`).then((r) => r.data),

  restaurar: (id: number) =>
    apiClient.put<void>(`/usuarios/${id}/restore`).then((r) => r.data),
};