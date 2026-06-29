import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { partidosApi } from '@/api/partidos';
import { getApiErrorMessage } from '@/api/client';
import type {
  PartidoCreateRequest,
  PartidoResultadoRequest,
  PartidoUpdateRequest,
} from '@/types/domain';

export const partidosKeys = {
  all: ['partidos'] as const,
  porFecha: (fechaId?: number) => ['partidos', { fechaId }] as const,
};

export function usePartidos(fechaId?: number) {
  return useQuery({
    queryKey: partidosKeys.porFecha(fechaId),
    queryFn: () => partidosApi.listar(fechaId),
  });
}

export function useCrearPartido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PartidoCreateRequest) => partidosApi.crear(data),
    onSuccess: () => {
      toast.success('Partido creado');
      queryClient.invalidateQueries({ queryKey: partidosKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useActualizarPartido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PartidoUpdateRequest }) =>
      partidosApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Partido actualizado');
      queryClient.invalidateQueries({ queryKey: partidosKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useCargarResultado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PartidoResultadoRequest) => partidosApi.cargarResultado(data),
    onSuccess: () => {
      toast.success('Resultado cargado, puntos calculados');
      queryClient.invalidateQueries({ queryKey: partidosKeys.all });
      queryClient.invalidateQueries({ queryKey: ['predicciones'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useEliminarPartido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => partidosApi.eliminar(id),
    onSuccess: () => {
      toast.success('Partido eliminado');
      queryClient.invalidateQueries({ queryKey: partidosKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
