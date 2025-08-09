import { updateUserProfilePicture } from '@/utils/userStore';
import { useQuery } from '@tanstack/react-query';

type UserProfile = {
  id: number;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  profilePicture: string | null;
  createdAt: string;
  dateOfBirth: string | null;
};

export const useUserProfileQuery = () => {
  return useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await fetch('/api/user/profile');
      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases gracefully
        if (res.status === 401) {
          throw new Error('Please log in to view your profile');
        }
        if (res.status === 403) {
          throw new Error('You do not have permission to view this profile');
        }
        throw new Error(data.message || 'Failed to load profile');
      }

      updateUserProfilePicture(data.user?.profilePicture || null);
      return data.user;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error.message?.includes('log in') ||
        error.message?.includes('permission')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
