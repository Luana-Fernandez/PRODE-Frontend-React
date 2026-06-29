import { apiClient } from './client';
import type { EstadoPartido, Prediccion, PrediccionCreateRequest } from '@/types/domain';

export const prediccionesApi = {
  listar: (estadoPartido?: EstadoPartido) =>
    apiClient
      .get<Prediccion[]>('/api/predicciones', {
        params: estadoPartido ? { estado: estadoPartido } : undefined,
      })
      .then((r) => r.data),

  porUsuario: (idUsuario: number) =>
    apiClient.get<Prediccion[]>(`/api/predicciones/usuario/${idUsuario}`).then((r) => r.data),

  porPartido: (idPartido: number) =>
    apiClient.get<Prediccion[]>(`/api/predicciones/partido/${idPartido}`).then((r) => r.data),

  porUsuarioYFecha: (idUsuario: number, idFecha: number) =>
    apiClient
      .get<Prediccion[]>(`/api/predicciones/usuario/${idUsuario}/fecha/${idFecha}`)
      .then((r) => r.data),

  crear: (data: PrediccionCreateRequest) =>
    apiClient.post<Prediccion>('/api/predicciones', data).then((r) => r.data),
};