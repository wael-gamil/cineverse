import { useQuery } from '@tanstack/react-query';

export const useWatchlistExistsQuery = (contentId: number, enabled = true) => {
  return useQuery({
    queryKey: ['watchlist-exists', contentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/watchlist/exists?contentId=${contentId}`
      );

      if (!response.ok) {
        throw new Error('Failed to check watchlist existence');
      }

      const data = await response.json();
      return data.exists;
    },
    enabled: enabled && !!contentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
