import { useQuery } from '@tanstack/react-query';
import { UserReview } from '@/constants/types/movie';

interface UsePublicUserReviewsParams {
  username: string;
  page?: number;
  size?: number;
}

type UserReviewsResponse = {
  reviews: UserReview[];
  totalPages: number;
  currentPage: number;
};

export function usePublicUserReviews({
  username,
  page = 0,
  size = 10,
}: UsePublicUserReviewsParams) {
  return useQuery<UserReviewsResponse>({
    queryKey: ['publicUserReviews', username, page, size],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/reviews/public?username=${username}&page=${page}&size=${size}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch user reviews');
      }

      return data;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
