import { useQuery } from '@tanstack/react-query';
import { WatchlistItem } from '@/constants/types/movie';

type WatchlistResponse = {
  items: WatchlistItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
};

export function useWatchlistQuery(
  username: string,
  status: 'TO_WATCH' | 'WATCHED',
  page = 0,
  size = 10,
  enabled = true
) {
  return useQuery<WatchlistResponse>({
    queryKey: ['watchlist', username, status, page, size],
    queryFn: async () => {
      const res = await fetch(
        `/api/watchlist?username=${username}&status=${status}&page=${page}&size=${size}`
      );
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('User not found');
        }
        if (res.status === 403) {
          throw new Error('This watchlist is private');
        }
        throw new Error(data.message || 'Failed to load watchlist');
      }

      return data;
    },
    retry: (failureCount, error) => {
      // Don't retry on user not found or private watchlist
      if (
        error.message?.includes('not found') ||
        error.message?.includes('private')
      ) {
        return false;
      }
      return failureCount < 2;
    },
    enabled,
  });
}
