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
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
