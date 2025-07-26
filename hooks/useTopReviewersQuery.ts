import { useQuery } from '@tanstack/react-query';

type Reviewer = {
  user: {
    userId: number;
    username: string;
    name: string;
    imageUrl: string;
  };
  reviewCount: number;
  averageRating: number;
};

export const useTopReviewersQuery = (size = 5) => {
  return useQuery<Reviewer[]>({
    queryKey: ['top-reviewers', size],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/top-reviewers?size=${size}`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to fetch top reviewers');
      return data.reviewers;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
