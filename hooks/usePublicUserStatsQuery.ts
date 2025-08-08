import { useQuery } from '@tanstack/react-query';

export const usePublicUserStatsQuery = (username: string) => {
  return useQuery<{ reviewCount: number; watchlistCount: number }>({
    queryKey: ['public-user-stats', username],
    queryFn: async () => {
      const res = await fetch(`/api/user/stats?username=${username}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user stats');
      }
      return data.stats;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
