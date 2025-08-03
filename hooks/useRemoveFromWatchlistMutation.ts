import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRemoveFromWatchlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: number) => {
      const response = await fetch(
        `/api/watchlist/remove?contentId=${contentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from watchlist');
      }

      return response.json();
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
