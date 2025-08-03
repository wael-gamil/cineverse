import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/constants/types/movie';

export const usePublicUserProfileQuery = (username: string) => {
  return useQuery<UserProfile>({
    queryKey: ['public-user-profile', username],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile/public?username=${username}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      return data.user;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
