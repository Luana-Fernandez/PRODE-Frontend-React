import { apiClient } from './client';
import type {
  Grupo,
  GrupoCreateRequest,
  GrupoUnirseRequest,
  GrupoUpdateRequest,
} from '@/types/domain';

export const gruposApi = {
  listar: (usuarioId: number) =>
    apiClient.get<Grupo[]>(`/grupos/usuario/${usuarioId}`).then((r) => r.data),

  obtener: (id: number) => apiClient.get<Grupo>(`/grupos/${id}`).then((r) => r.data),

  crear: (usuarioId: number, data: GrupoCreateRequest) =>
    apiClient.post<Grupo>(`/grupos/usuario/${usuarioId}`, data).then((r) => r.data),

  unirse: (usuarioId: number, data: GrupoUnirseRequest) =>
    apiClient.post<Grupo>(`/grupos/unirse/${usuarioId}`, data).then((r) => r.data),

  actualizar: (id: number, data: GrupoUpdateRequest) =>
    apiClient.put<Grupo>(`/grupos/${id}`, data).then((r) => r.data),

  eliminar: (id: number) => apiClient.delete<void>(`/grupos/${id}`).then((r) => r.data),
};