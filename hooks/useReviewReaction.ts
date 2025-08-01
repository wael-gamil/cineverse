import { useReactToReview } from './useReactToReview';
import toast from 'react-hot-toast';
import { useCallback, useRef, useEffect, useState } from 'react';

type Review = {
  reviewId: number;
  userReaction?: 'LIKE' | 'DISLIKE' | null;
};

type UseReviewReactionOptions = {
  debounceDelay?: number; // Default: 500ms
  rateLimit?: number; // Default: 10 reactions per minute
  rateLimitWindow?: number; // Default: 60000ms (1 minute)
};

export const useReviewReaction = (
  reviews: Review[],
  refetch: () => void,
  options: UseReviewReactionOptions = {}
) => {
  const { mutate: reactToReview } = useReactToReview();

  // Configuration with defaults
  const {
    debounceDelay = 500,
    rateLimit = 10,
    rateLimitWindow = 60000,
  } = options;

  // Track pending requests to prevent duplicates
  const pendingRequests = useRef<Set<number>>(new Set());

  // Debounce timers for each review
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Track the latest intended reaction for each review during debounce
  const pendingReactions = useRef<Map<number, 'LIKE' | 'DISLIKE' | 'UNDO'>>(
    new Map()
  );
  // Track pending reactions for UI feedback
  const [pendingReactionStates, setPendingReactionStates] = useState<
    Map<number, 'LIKE' | 'DISLIKE' | 'UNDO'>
  >(new Map());

  // Rate limiting: track recent reactions per user session
  const recentReactions = useRef<number[]>([]);
  const handleReactToReview = useCallback(
    async (reviewId: number, type: 'LIKE' | 'DISLIKE') => {
      // Rate limiting check
      const now = Date.now();
      const recentCount = recentReactions.current.filter(
        timestamp => now - timestamp < rateLimitWindow
      ).length;

      if (recentCount >= rateLimit) {
        toast.error('Too many reactions! Please slow down.', {
          className: 'toast-default',
        });
        return;
      }

      // Prevent multiple simultaneous requests for the same review
      if (pendingRequests.current.has(reviewId)) {
        return;
      }

      // Clear existing debounce timer for this review
      const existingTimer = debounceTimers.current.get(reviewId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Find the current review to check existing reaction
      const currentReview = reviews.find(
        review => review.reviewId === reviewId
      );

      // Determine the actual type to send based on current reaction
      let actionType: 'LIKE' | 'DISLIKE' | 'UNDO' = type;
      if (currentReview?.userReaction === type) {
        // User is clicking the same reaction again, so undo it
        actionType = 'UNDO';
      } // Store the intended reaction
      pendingReactions.current.set(reviewId, actionType);

      // Update UI state for immediate feedback
      setPendingReactionStates(prev => new Map(prev).set(reviewId, actionType));

      // Debounce the actual API call
      const timer = setTimeout(async () => {
        const finalActionType = pendingReactions.current.get(reviewId);
        if (!finalActionType) return; // Add to rate limiting tracker
        recentReactions.current.push(Date.now());
        // Clean up old timestamps
        recentReactions.current = recentReactions.current.filter(
          timestamp => Date.now() - timestamp < rateLimitWindow
        );

        // Mark as pending to prevent duplicates
        pendingRequests.current.add(reviewId);

        // Clear the pending reaction since we're about to process it
        pendingReactions.current.delete(reviewId);
        debounceTimers.current.delete(reviewId);

        try {
          const reactPromise = new Promise<void>((resolve, reject) => {
            reactToReview(
              {
                reviewId,
                type: finalActionType,
              },
              {
                onSuccess: () => {
                  resolve();
                  refetch();
                },
                onError: (err: any) => {
                  reject(err);
                },
              }
            );
          });

          await toast.promise(
            reactPromise,
            {
              loading:
                finalActionType === 'UNDO'
                  ? 'Removing reaction...'
                  : `${
                      finalActionType === 'LIKE' ? 'Liking' : 'Disliking'
                    } review...`,
              success:
                finalActionType === 'UNDO'
                  ? 'Reaction removed!'
                  : 'Reaction recorded!',
              error: 'Failed to react to review.',
            },
            {
              className: 'toast-default',
            }
          );
        } finally {
          // Remove from pending requests and UI state
          pendingRequests.current.delete(reviewId);
          setPendingReactionStates(prev => {
            const newMap = new Map(prev);
            newMap.delete(reviewId);
            return newMap;
          });
        }
      }, debounceDelay); // Use configurable debounce delay

      debounceTimers.current.set(reviewId, timer);
    },
    [reviews, refetch, reactToReview]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
      pendingRequests.current.clear();
      pendingReactions.current.clear();
    };
  }, []);

  return {
    handleReactToReview,
    isPending: (reviewId: number) => pendingRequests.current.has(reviewId),
    getPendingReaction: (reviewId: number) =>
      pendingReactionStates.get(reviewId),
  };
};
