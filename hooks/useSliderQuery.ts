import { useQuery } from '@tanstack/react-query';

type FilterType = 'ALL' | 'MOVIE' | 'SERIES';
export function useSliderQuery(
  fetchUrl: string,
  title: string,
  page: number,
  filter: FilterType,
  enabled?: boolean
) {
  return useQuery({
    queryKey: ['slider', title, page, filter],
    queryFn: async () => {
      let url = `${fetchUrl}page=${page}&type=${
        filter !== 'ALL' ? filter : ''
      }`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${title} content`);

      return await res.json();
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
