import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usuariosApi, type UsuarioUpdateRequest } from '@/api/usuariosApi';
import { getApiErrorMessage } from '@/api/client';

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosApi.listar,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['usuarios', 'me'],
    queryFn: usuariosApi.obtenerMe,
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsuarioUpdateRequest }) =>
      usuariosApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Datos actualizados');
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.eliminar(id),
    onSuccess: () => {
      toast.success('Usuario eliminado');
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}