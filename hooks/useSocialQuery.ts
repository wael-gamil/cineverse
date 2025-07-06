import { useQuery } from '@tanstack/react-query';
import { SocialLinks } from '@/constants/types/movie';

export function useSocialQuery(id: number, enabled?: boolean) {
  return useQuery({
    queryKey: ['social', id],
    queryFn: async () => {
      let url = `/api/proxy/actor/social?id=${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch social');
      return (await res.json()) as SocialLinks;
    },
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
