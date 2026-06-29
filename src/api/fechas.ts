import { apiClient } from './client';
import type { EstadoFecha, Fecha, FechaCreateRequest, FechaUpdateRequest } from '@/types/domain';

export const fechasApi = {
  listar: () => apiClient.get<Fecha[]>('/fechas').then((r) => r.data),

  filtrarPorEstado: (estado: EstadoFecha) =>
    apiClient.get<Fecha[]>('/fechas/estado', { params: { estado } }).then((r) => r.data),

  crear: (data: FechaCreateRequest) =>
    apiClient.post<Fecha>('/fechas', data).then((r) => r.data),

  actualizar: (id: number, data: FechaUpdateRequest) =>
    apiClient.put<Fecha>(`/fechas/${id}`, data).then((r) => r.data),

  eliminar: (id: number) => apiClient.delete<void>(`/fechas/${id}`).then((r) => r.data),
};
