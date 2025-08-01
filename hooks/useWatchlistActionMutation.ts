import { useMutation, useQueryClient } from '@tanstack/react-query';

type WatchlistAction =
  | {
      mode: 'update';
      payload: { watchlistId: number; status: 'WATCHED' | 'TO_WATCH' };
      contentId?: number; // Optional for cache invalidation
    }
  | { mode: 'delete'; id: number; contentId?: number }; // Optional for cache invalidation

export const useWatchlistActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: WatchlistAction) => {
      if (action.mode === 'update') {
        const res = await fetch('/api/watchlist/action', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.payload),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || 'Failed to update watchlist');
        return data;
      }

      if (action.mode === 'delete') {
        const res = await fetch(`/api/watchlist/action?id=${action.id}`, {
          method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || 'Failed to delete watchlist item');
        return data;
      }

      throw new Error('Invalid watchlist action');
    },
    onSuccess: (data, action) => {
      // Invalidate watchlist queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['user-watchlist'],
      });

      // For delete operations, also invalidate the watchlist existence query if contentId is provided
      if (action.mode === 'delete' && action.contentId) {
        queryClient.invalidateQueries({
          queryKey: ['watchlist-exists', action.contentId],
        });
      }

      // For update operations, also invalidate the watchlist existence query if contentId is provided
      if (action.mode === 'update' && action.contentId) {
        queryClient.invalidateQueries({
          queryKey: ['watchlist-exists', action.contentId],
        });
      }
    },
  });
};
