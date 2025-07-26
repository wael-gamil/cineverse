// hooks/useAllReviews.ts
import { useQuery } from '@tanstack/react-query';
import { ExtendedReview } from '@/constants/types/movie';

type AllReviewsResponse = {
  reviews: ExtendedReview[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
};

export function useAllReviews(page = 0, size = 10, enabled = true) {
  return useQuery<AllReviewsResponse>({
    queryKey: ['all-reviews', page, size],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/all?page=${page}&size=${size}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
