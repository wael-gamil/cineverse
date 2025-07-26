import { useQuery } from '@tanstack/react-query';

type TopReviewedContent = {
  contentId: number;
  title: string;
  contentType: 'MOVIE' | 'SERIES';
  averageRate: number;
  reviewCount: number;
};

export const useTopReviewedContentQuery = () => {
  return useQuery<TopReviewedContent[]>({
    queryKey: ['top-reviewed-content'],
    queryFn: async () => {
      const res = await fetch('/api/reviews/top-reviewed');
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to fetch top reviewed content');
      return data.topContent;
    },
    staleTime: 1000 * 60 * 5,
  });
};
