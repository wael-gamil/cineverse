import { useQuery } from '@tanstack/react-query';
import { UserReview } from '@/constants/types/movie';

type UserReviewsResponse = {
  reviews: UserReview[];
  totalPages: number;
  currentPage: number;
};

export const useUserReviews = (
  username: string,
  page: number = 0,
  size: number = 10,
  enabled: boolean = true
) => {
  return useQuery<UserReviewsResponse>({
    queryKey: ['user-reviews', username, page, size],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/reviews?username=${username}&page=${page}&size=${size}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user reviews');
      }

      return data.user; // This is { reviews, totalPages, currentPage }
    },
    enabled: !!username && enabled,
    staleTime: 0,
  });
};
