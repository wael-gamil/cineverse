import { useQuery } from '@tanstack/react-query';
import { Trailer } from '@/constants/types/movie';

export function useTrailerQuery(id: number, enabled?: boolean) {
  return useQuery({
    queryKey: ['trailer', id],
    queryFn: async () => {
      let url = `/api/proxy/trailer?id=${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch trailer');
      return (await res.json()) as Trailer;
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
