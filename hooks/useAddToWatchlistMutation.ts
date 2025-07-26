import { useMutation } from '@tanstack/react-query';

export const useAddToWatchlistMutation = () => {
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
  });
};
