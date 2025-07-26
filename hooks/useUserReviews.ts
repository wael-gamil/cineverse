import { useQuery } from '@tanstack/react-query';
import { UserReview } from '@/constants/types/movie';

type UserReviewsResponse = {
  reviews: UserReview[];
  totalPages: number;
  currentPage: number;
};

export const useUserReviews = (username: string) => {
  return useQuery<UserReviewsResponse>({
    queryKey: ['user-reviews', username],
    queryFn: async () => {
      const res = await fetch(`/api/user/reviews?username=${username}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user reviews');
      }

      return data.user; // This is { reviews, totalPages, currentPage }
    },
    enabled: !!username,
    staleTime: 0,
  });
};
