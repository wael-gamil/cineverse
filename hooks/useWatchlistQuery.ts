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
      if (!res.ok) throw new Error(data.message || 'Failed to fetch watchlist');
      return data;
    },
    enabled,
  });
}
