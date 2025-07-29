import { useQuery } from '@tanstack/react-query';
import { Content } from '@/constants/types/movie';

type PersonContentResponse = {
  content: Content[];
  totalPages: number;
};

export function usePersonContentQuery(
  id: number,
  options?: {
    page?: number;
    type?: 'MOVIE' | 'SERIES';
    enabled?: boolean;
  }
) {
  const { page = 0, type, enabled = true } = options || {};

  return useQuery({
    queryKey: ['person-content', id, page, type],
    queryFn: async () => {
      const params = new URLSearchParams({
        id: String(id),
        page: String(page),
      });
      if (type) params.set('type', type);

      const url = `/api/proxy/actor/content?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch content');

      const raw: PersonContentResponse = await res.json();

      return raw;
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
