import { useQuery } from '@tanstack/react-query';
import { Stats } from '@/constants/types/movie';

export function useStatsQuery(id: number, enabled?: boolean) {
  return useQuery({
    queryKey: ['stats', id],
    queryFn: async () => {
      let url = `/api/proxy/stats?id=${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return (await res.json()) as Stats;
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
