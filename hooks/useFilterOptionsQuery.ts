import { useQuery } from '@tanstack/react-query';
import { FilterOpt } from '@/constants/types/movie';

export function useFilterOptionsQuery(enabled?: boolean) {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      let url = `/api/proxy/filterOptions`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch filter options');
      return (await res.json()) as FilterOpt[];
    },
    enabled,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
}
