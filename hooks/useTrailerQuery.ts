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
    retry: false,
    enabled,
    staleTime: 1000 * 60 * 10, 
  });
}
