import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fechasApi } from '@/api/fechas';
import { getApiErrorMessage } from '@/api/client';
import type { EstadoFecha, FechaCreateRequest, FechaUpdateRequest } from '@/types/domain';

export const fechasKeys = {
  all: ['fechas'] as const,
  porEstado: (estado?: EstadoFecha | 'TODAS') =>
    ['fechas', 'estado', estado ?? 'TODAS'] as const,
};

export function useFechas() {
  return useQuery({
    queryKey: fechasKeys.all,
    queryFn: fechasApi.listar,
  });
}

export function useFechasPorEstado(estado: EstadoFecha | undefined) {
  return useQuery({
    queryKey: fechasKeys.porEstado(estado as EstadoFecha),
    queryFn: () => fechasApi.filtrarPorEstado(estado as EstadoFecha),
    enabled: !!estado,
  });
}

export function useCrearFecha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FechaCreateRequest) => fechasApi.crear(data),
    onSuccess: () => {
      toast.success('Fecha creada');
      queryClient.invalidateQueries({ queryKey: fechasKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useActualizarFecha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FechaUpdateRequest }) =>
      fechasApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Fecha actualizada');
      queryClient.invalidateQueries({ queryKey: fechasKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useEliminarFecha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fechasApi.eliminar(id),
    onSuccess: () => {
      toast.success('Fecha eliminada');
      queryClient.invalidateQueries({ queryKey: fechasKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
