import { useQuery } from '@tanstack/react-query';
import { Episode } from '@/app/constants/types/movie';

export function useEpisodeQuery(
  seriesId: number,
  seasonNumber: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: ['episode-section', seriesId, seasonNumber],
    queryFn: async () => {
      let url = `/api/proxy/episodes?id=${seriesId}&seasonNumber=${seasonNumber}`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(
          'Failed to fetch series ID: ' +
            seriesId +
            ' and season Number' +
            seasonNumber
        );
      return (await res.json()) as Episode[];
    },
    enabled,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
}
