import { useQuery } from '@tanstack/react-query';
import { Content } from '@/constants/types/movie';

type RawContent = Omit<Content, 'posterUrl'> & {
  posterPath: string;
};

type PersonContentResponse = {
  content: RawContent[];
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

      const content: Content[] = raw.content.map(item => ({
        ...item,
        posterUrl: item.posterPath,
      }));

      return {
        ...raw,
        content,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
