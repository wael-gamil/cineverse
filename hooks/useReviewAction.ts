import { useMutation } from '@tanstack/react-query';

type ReviewAction =
  | { mode: 'delete'; id: number }
  | {
      mode: 'update';
      review: {
        reviewId: number;
        rate: number;
        title: string;
        description: string;
        spoiler: boolean;
      };
    };

export function useReviewAction() {
  return useMutation({
    mutationFn: async (action: ReviewAction) => {
      if (action.mode === 'delete') {
        const res = await fetch(`/api/reviews/action?id=${action.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete review');
        }
        return res.json();
      }

      if (action.mode === 'update') {
        const res = await fetch(`/api/reviews/action`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.review),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update review');
        }
        return res.json();
      }

      throw new Error('Invalid review action');
    },
  });
}
