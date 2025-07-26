import { useMutation } from '@tanstack/react-query';

type WatchlistAction =
  | {
      mode: 'update';
      payload: { watchlistId: number; status: 'WATCHED' | 'TO_WATCH' };
    }
  | { mode: 'delete'; id: number };

export const useWatchlistActionMutation = () => {
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
  });
};
