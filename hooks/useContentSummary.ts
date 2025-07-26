import { useQuery } from '@tanstack/react-query';

type ContentSummary = {
  contentType: string;
  slug: string;
  seasonNumber: number | null;
  episodeNumber: number | null;
};

export function useContentSummary(
  contentId: number,
  contentType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE',
  enabled: boolean = true
) {
  return useQuery<ContentSummary>({
    queryKey: ['content-summary', contentId, contentType],
    queryFn: async () => {
      const res = await fetch(
        `/api/content/summary?id=${contentId}&type=${contentType}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch summary for content ID ${contentId}`);
      }
      return await res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
