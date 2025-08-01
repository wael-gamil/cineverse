import { useQuery } from '@tanstack/react-query';
import { WatchlistItem } from '@/constants/types/movie';

interface UsePublicUserWatchlistQueryParams {
  username: string;
  status: 'TO_WATCH' | 'WATCHED';
  page?: number;
  size?: number;
}

type WatchlistResponse = {
  items: WatchlistItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
};

export function usePublicUserWatchlistQuery({
  username,
  status,
  page = 0,
  size = 10,
}: UsePublicUserWatchlistQueryParams) {
  return useQuery<WatchlistResponse>({
    queryKey: ['publicUserWatchlist', username, status, page, size],
    queryFn: async () => {
      const res = await fetch(
        `/api/watchlist/public?username=${username}&status=${status}&page=${page}&size=${size}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user watchlist');
      }

      return data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
