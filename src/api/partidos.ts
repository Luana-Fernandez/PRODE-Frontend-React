import { apiClient } from './client';
import type {
  Partido,
  PartidoCreateRequest,
  PartidoResultadoRequest,
  PartidoUpdateRequest,
} from '@/types/domain';

export const partidosApi = {
  listar: (fechaId?: number) =>
    apiClient
      .get<Partido[]>('/partidos', { params: fechaId ? { fechaId } : undefined })
      .then((r) => r.data),

  crear: (data: PartidoCreateRequest) =>
    apiClient.post<Partido>('/partidos', data).then((r) => r.data),

  actualizar: (id: number, data: PartidoUpdateRequest) =>
    apiClient.patch<Partido>(`/partidos/${id}`, data).then((r) => r.data),

  cargarResultado: (data: PartidoResultadoRequest) =>
    apiClient.put<Partido>('/api/partidos/resultado', data).then((r) => r.data),

  eliminar: (id: number) => apiClient.delete<void>(`/partidos/${id}`).then((r) => r.data),
};