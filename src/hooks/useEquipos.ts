import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { equiposApi } from '@/api/equipos';
import { getApiErrorMessage } from '@/api/client';
import type { EquipoCreateRequest, EquipoUpdateRequest } from '@/types/domain';

export const equiposKeys = {
  all: ['equipos'] as const,
};

export function useEquipos() {
  return useQuery({
    queryKey: equiposKeys.all,
    queryFn: equiposApi.listar,
  });
}

export function useCrearEquipo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EquipoCreateRequest) => equiposApi.crear(data),
    onSuccess: () => {
      toast.success('Equipo creado');
      queryClient.invalidateQueries({ queryKey: equiposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useActualizarEquipo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EquipoUpdateRequest }) =>
      equiposApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Equipo actualizado');
      queryClient.invalidateQueries({ queryKey: equiposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useEliminarEquipo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => equiposApi.eliminar(id),
    onSuccess: () => {
      toast.success('Equipo eliminado');
      queryClient.invalidateQueries({ queryKey: equiposKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
