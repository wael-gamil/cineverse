import { useQuery } from '@tanstack/react-query';

type SectionType = 'credits' | 'seasons' | 'reviews' | 'episodes';

export function useContentSectionQuery(
  section: SectionType,
  id: number,
  enabled: boolean,
  seasonNumber?: number,
  sortBy?: string
) {
  return useQuery({
    queryKey: ['content-section', section, id, seasonNumber, sortBy],
    queryFn: async () => {
      let url = '';
      switch (section) {
        case 'credits':
          url = `/api/proxy/credits?id=${id}`;
          break;
        case 'reviews':
          url = `/api/proxy/reviews?id=${id}&sortBy=${sortBy || 'likes'}`;
          break;
        case 'seasons':
          url = `/api/proxy/seasons?id=${id}`;
          break;
        case 'episodes':
          if (!seasonNumber) throw new Error('Missing season number');
          url = `/api/proxy/episodes?id=${id}&seasonNumber=${seasonNumber}`;
          break;
        default:
          throw new Error('Unknown section');
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch ' + section);
      return await res.json();
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
