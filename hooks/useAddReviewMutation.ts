import { useMutation } from '@tanstack/react-query';

type ReviewPayload = {
  contentId: number;
  rate: number;
  title: string;
  description: string;
  spoiler: boolean;
};

export const useAddReviewMutation = () => {
  return useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      const res = await fetch('/api/reviews/add-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to post review');
      }
      return data;
    },
  });
};
