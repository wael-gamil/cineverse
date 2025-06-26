// hooks/useContentSectionQuery.ts
import { useQuery } from '@tanstack/react-query';
import { Credits, Review, Season } from '@/constants/types/movie';

type SectionType = 'credits' | 'seasons' | 'reviews';

export function useContentSectionQuery(section: SectionType, id: number, enabled: boolean) {
  return useQuery({
    queryKey: ['content-section', section, id],
    queryFn: async () => {
      let url = '';
      switch (section) {
        case 'credits':
          url = `/api/proxy/credits?id=${id}`;
          break;
        case 'reviews':
          url = `/api/proxy/reviews?id=${id}`;
          break;
        case 'seasons':
          url = `/api/proxy/seasons?id=${id}`;
          break;
        default:
          throw new Error('Unknown section');
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch ' + section);
      return await res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
}
