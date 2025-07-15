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

      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

      return data.user;
    },
    staleTime: 1000 * 60 * 5,
  });
};
