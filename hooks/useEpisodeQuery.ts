import { useQuery } from '@tanstack/react-query';
import { Episode } from '@/constants/types/movie';

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
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
