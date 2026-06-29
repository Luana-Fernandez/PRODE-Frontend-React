import { apiClient } from './client';
import type { Equipo, EquipoCreateRequest, EquipoUpdateRequest } from '@/types/domain';

export const equiposApi = {
  listar: () => apiClient.get<Equipo[]>('/equipos').then((r) => r.data),

  obtener: (id: number) => apiClient.get<Equipo>(`/equipos/${id}`).then((r) => r.data),

  crear: (data: EquipoCreateRequest) =>
    apiClient.post<Equipo>('/equipos', data).then((r) => r.data),

  actualizar: (id: number, data: EquipoUpdateRequest) =>
    apiClient.put<Equipo>(`/equipos/${id}`, data).then((r) => r.data),

  eliminar: (id: number) => apiClient.delete<void>(`/equipos/${id}`).then((r) => r.data),
};
