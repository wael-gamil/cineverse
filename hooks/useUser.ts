import { useQuery } from '@tanstack/react-query';

type User = {
  id: number;
  email: string;
  username: string;
};

export const useCurrentUserQuery = () => {
  return useQuery<User>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch user');

      return data.user;
    },
    staleTime: 1000 * 60 * 5,
  });
};
