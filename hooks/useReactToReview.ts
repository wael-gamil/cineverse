import { useMutation } from '@tanstack/react-query';

export const useReactToReview = () => {
  return useMutation({
    mutationFn: async ({
      reviewId,
      type,
    }: {
      reviewId: number;
      type: 'LIKE' | 'DISLIKE' | 'UNDO';
    }) => {
      const res = await fetch('/api/reviews/react', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, type }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to react to review');
      }

      return data;
    },
  });
};
