import { apiClient } from './client';
import type { RankingItem } from '@/types/domain';

export const rankingApi = {
  global: () => apiClient.get<RankingItem[]>('/ranking').then((r) => r.data),

  porGrupo: (grupoId: number) =>
    apiClient.get<RankingItem[]>(`/ranking/grupo/${grupoId}`).then((r) => r.data),
};
