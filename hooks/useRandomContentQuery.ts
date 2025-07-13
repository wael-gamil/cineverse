import { Content } from '@/constants/types/movie';
import { useQuery } from '@tanstack/react-query';

export function useRandomContentQuery(enabled: boolean = true) {
  return useQuery<Content>({
    queryKey: ['randomContent'],
    queryFn: async () => {
      const res = await fetch('/api/random-content');
      if (!res.ok) throw new Error('Failed to fetch random content');
      return await res.json();
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
