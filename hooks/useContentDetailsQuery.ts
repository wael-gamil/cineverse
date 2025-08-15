import { useQuery } from '@tanstack/react-query';
import { Movie, Series } from '@/constants/types/movie';

export function useContentDetailsQuery(slug: string, enabled: boolean = true) {
  return useQuery<Movie | Series>({
    queryKey: ['content', slug],
    queryFn: async () => {
      const res = await fetch(`/api/content/details?slug=${slug}`);
      if (!res.ok) {
        throw new Error('Failed to fetch content details');
      }
      return await res.json();
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes - matches your existing setup
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
