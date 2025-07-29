// hooks/useAllReviews.ts
import { useQuery } from '@tanstack/react-query';
import { ExtendedReview } from '@/constants/types/movie';

type AllReviewsResponse = {
  reviews: ExtendedReview[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
};

export function useAllReviews(
  page = 0,
  size = 10,
  sortBy = 'recent',
  enabled = true
) {
  return useQuery<AllReviewsResponse>({
    queryKey: ['all-reviews', page, size, sortBy],
    queryFn: async () => {
      const res = await fetch(
        `/api/reviews/all?page=${page}&size=${size}&sortBy=${sortBy}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
