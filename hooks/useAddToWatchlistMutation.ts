import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddToWatchlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: number) => {
      const res = await fetch('/api/watchlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to add to watchlist');
      return data;
    },
    onSuccess: (_, contentId) => {
      // Invalidate watchlist existence query for this content
      queryClient.invalidateQueries({
        queryKey: ['watchlist-exists', contentId],
      });

      // Invalidate watchlist queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['user-watchlist'],
      });
    },
  });
};
