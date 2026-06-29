import { apiClient } from './client';

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  idGrupoPropio: number | null;
}

export const usuariosApi = {
  listar: () => apiClient.get<UsuarioResponse[]>('/usuarios').then((r) => r.data),
};