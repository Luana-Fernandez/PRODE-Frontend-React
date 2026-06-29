import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '@/auth/useAuth';
import { gruposApi } from '@/api/gruposApi';
import { getApiErrorMessage } from '@/api/client';
import type { GrupoCreateRequest, GrupoUnirseRequest, GrupoUpdateRequest } from '@/types/domain';

export const gruposKeys = {
  all: ['grupos'] as const,
  detalle: (id: number) => ['grupos', id] as const,
};

export function useGrupos() {
  const { usuario } = useAuth();
  return useQuery({
    queryKey: gruposKeys.all,
    queryFn: () => gruposApi.listar(usuario!.id),
    enabled: !!usuario,
  });
}

export function useGrupo(id?: number) {
  return useQuery({
    queryKey: gruposKeys.detalle(id as number),
    queryFn: () => gruposApi.obtener(id as number),
    enabled: !!id,
  });
}

export function useCrearGrupo() {
  const queryClient = useQueryClient();
  const { usuario } = useAuth();
  return useMutation({
    mutationFn: (data: GrupoCreateRequest) => gruposApi.crear(usuario!.id, data),
    onSuccess: () => {
      toast.success('Grupo creado');
      queryClient.invalidateQueries({ queryKey: gruposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUnirseGrupo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ usuarioId, data }: { usuarioId: number; data: GrupoUnirseRequest }) =>
      gruposApi.unirse(usuarioId, data),
    onSuccess: () => {
      toast.success('Te uniste al grupo');
      queryClient.invalidateQueries({ queryKey: gruposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useActualizarGrupo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GrupoUpdateRequest }) =>
      gruposApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Grupo actualizado');
      queryClient.invalidateQueries({ queryKey: gruposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useEliminarGrupo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gruposApi.eliminar(id),
    onSuccess: () => {
      toast.success('Grupo eliminado');
      queryClient.invalidateQueries({ queryKey: gruposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
