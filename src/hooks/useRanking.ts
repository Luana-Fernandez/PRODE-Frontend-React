import { useQuery } from '@tanstack/react-query';
import { rankingApi } from '@/api/ranking';

export const rankingKeys = {
  global: ['ranking', 'global'] as const,
  grupo: (grupoId: number) => ['ranking', 'grupo', grupoId] as const,
};

export function useRankingGlobal() {
  return useQuery({
    queryKey: rankingKeys.global,
    queryFn: rankingApi.global,
  });
}

export function useRankingGrupo(grupoId?: number) {
  return useQuery({
    queryKey: rankingKeys.grupo(grupoId as number),
    queryFn: () => rankingApi.porGrupo(grupoId as number),
    enabled: !!grupoId,
  });
}
