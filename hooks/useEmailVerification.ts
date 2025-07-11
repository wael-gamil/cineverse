import { useQuery } from '@tanstack/react-query';

export const useEmailVerification = (token: string | null) => {
  return useQuery({
    queryKey: ['email-verification', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is missing');

      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      return data.message;
    },
    enabled: !!token,
  });
};
