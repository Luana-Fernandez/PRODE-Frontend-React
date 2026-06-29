import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { prediccionesApi } from '@/api/predicciones';
import { getApiErrorMessage } from '@/api/client';
import type { EstadoPartido, PrediccionCreateRequest } from '@/types/domain';

export const prediccionesKeys = {
  all: ['predicciones'] as const,
  porEstado: (estado?: EstadoPartido) => ['predicciones', { estado }] as const,
  porUsuario: (idUsuario: number) => ['predicciones', 'usuario', idUsuario] as const,
  porPartido: (idPartido: number) => ['predicciones', 'partido', idPartido] as const,
  porUsuarioYFecha: (idUsuario: number, idFecha: number) =>
    ['predicciones', 'usuario', idUsuario, 'fecha', idFecha] as const,
};

export function usePredicciones(estado?: EstadoPartido) {
  return useQuery({
    queryKey: prediccionesKeys.porEstado(estado),
    queryFn: () => prediccionesApi.listar(estado),
  });
}

export function usePrediccionesDeUsuario(idUsuario?: number) {
  return useQuery({
    queryKey: prediccionesKeys.porUsuario(idUsuario as number),
    queryFn: () => prediccionesApi.porUsuario(idUsuario as number),
    enabled: !!idUsuario,
  });
}

export function usePrediccionesDePartido(idPartido?: number) {
  return useQuery({
    queryKey: prediccionesKeys.porPartido(idPartido as number),
    queryFn: () => prediccionesApi.porPartido(idPartido as number),
    enabled: !!idPartido,
  });
}

export function usePrediccionesDeUsuarioEnFecha(idUsuario?: number, idFecha?: number) {
  return useQuery({
    queryKey: prediccionesKeys.porUsuarioYFecha(idUsuario as number, idFecha as number),
    queryFn: () => prediccionesApi.porUsuarioYFecha(idUsuario as number, idFecha as number),
    enabled: !!idUsuario && !!idFecha,
  });
}

export function useCrearPrediccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PrediccionCreateRequest) => prediccionesApi.crear(data),
    onSuccess: () => {
      toast.success('Pronóstico guardado');
      queryClient.invalidateQueries({ queryKey: prediccionesKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
