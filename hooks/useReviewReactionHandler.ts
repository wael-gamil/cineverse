'use client';

import { useCallback, useRef, useState } from 'react';
import { useReactToReview } from './useReactToReview';
import { useAuth } from './useAuth';

type ReviewWithReactions = {
  reviewId: number;
  likeCount: number;
  dislikeCount: number;
  userReaction?: 'LIKE' | 'DISLIKE' | null;
};

type UseReviewReactionHandlerOptions<T extends ReviewWithReactions> = {
  reviews: T[];
  debounceMs?: number;
};

// Action queue item
type ReactionAction = {
  reviewId: number;
  targetReaction: 'LIKE' | 'DISLIKE' | null; // What the user wants the final state to be
  timestamp: number;
};

export function useReviewReactionHandler<T extends ReviewWithReactions>({
  reviews,
  debounceMs = 1000,
}: UseReviewReactionHandlerOptions<T>) {
  const { requireAuth } = useAuth();
  const { mutate: reactToReview } = useReactToReview();
  
  // Store current optimistic state for each review
  const [optimisticStates, setOptimisticStates] = useState<Map<number, {
    likeCount: number;
    dislikeCount: number;
    userReaction: 'LIKE' | 'DISLIKE' | null;
  }>>(new Map());
  
  // Queue to track what actions are pending
  const actionQueue = useRef<Map<number, ReactionAction>>(new Map());
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  
  // Track what we expect the server state to be after successful API calls
  const expectedServerStates = useRef<Map<number, {
    userReaction: 'LIKE' | 'DISLIKE' | null;
  }>>(new Map());
  
  // Get server state for a review
  const getServerState = useCallback((reviewId: number) => {
    return reviews.find(review => review.reviewId === reviewId);
  }, [reviews]);
  
  // Get what we expect the server reaction to be (after any successful API calls)
  const getExpectedServerReaction = useCallback((reviewId: number) => {
    const expectedState = expectedServerStates.current.get(reviewId);
    if (expectedState) {
      return expectedState.userReaction;
    }
    
    // If no expected state, use current server state
    const serverState = getServerState(reviewId);
    return serverState?.userReaction || null;
  }, [getServerState]);
  
  // Get current display state (server + optimistic updates)
  const getReviewState = useCallback(
    (reviewId: number) => {
      const serverReview = getServerState(reviewId);
      if (!serverReview) return null;
      
      const optimisticState = optimisticStates.get(reviewId);
      if (!optimisticState) return serverReview;
      
      return {
        ...serverReview,
        ...optimisticState,
      };
    },
    [getServerState, optimisticStates]
  );
  
  // Calculate optimistic state based on target reaction
  const calculateOptimisticState = useCallback((
    serverState: T,
    targetReaction: 'LIKE' | 'DISLIKE' | null
  ) => {
    const currentServerReaction = serverState.userReaction || null;
    let newLikeCount = serverState.likeCount;
    let newDislikeCount = serverState.dislikeCount;
    
    // Remove current server reaction effect
    if (currentServerReaction === 'LIKE') {
      newLikeCount--;
    } else if (currentServerReaction === 'DISLIKE') {
      newDislikeCount--;
    }
    
    // Apply target reaction effect
    if (targetReaction === 'LIKE') {
      newLikeCount++;
    } else if (targetReaction === 'DISLIKE') {
      newDislikeCount++;
    }
    
    return {
      likeCount: Math.max(0, newLikeCount),
      dislikeCount: Math.max(0, newDislikeCount),
      userReaction: targetReaction,
    };
  }, []);
    // Process the action queue and send API request
  const processAction = useCallback(async (reviewId: number) => {
    const action = actionQueue.current.get(reviewId);
    const serverState = getServerState(reviewId);
    
    if (!action || !serverState) return;
    
    // Use expected server reaction, not current server reaction
    const expectedServerReaction = getExpectedServerReaction(reviewId);
    const targetReaction = action.targetReaction;
    
    // If target is same as expected server state, no API call needed
    if (expectedServerReaction === targetReaction) {
      actionQueue.current.delete(reviewId);
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(reviewId);
        return newMap;
      });
      return;
    }
    
    // Determine API action type
    let apiActionType: 'LIKE' | 'DISLIKE' | 'UNDO';
    
    if (targetReaction === null) {
      apiActionType = 'UNDO';
    } else {
      apiActionType = targetReaction;
    }
    
    try {      await new Promise<void>((resolve, reject) => {
        reactToReview(
          {
            reviewId,
            type: apiActionType,
          },
          {
            onSuccess: () => {
              // Update expected server state to match what we just sent
              expectedServerStates.current.set(reviewId, {
                userReaction: targetReaction,
              });
              resolve();
            },
            onError: (err: any) => reject(err),
          }
        );
      });
      
      // Success - remove from queue
      actionQueue.current.delete(reviewId);
    } catch (error) {
      // Error - revert optimistic state and clean up
      actionQueue.current.delete(reviewId);
      expectedServerStates.current.delete(reviewId);
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(reviewId);
        return newMap;
      });
      console.error('Failed to react to review:', error);
    }
  }, [getServerState, getExpectedServerReaction, reactToReview]);
  
  const handleReactToReview = useCallback(
    async (reviewId: number, type: 'LIKE' | 'DISLIKE') => {
      if (!requireAuth(undefined, 'Please log in to react to reviews')) {
        return;
      }
      
      const serverState = getServerState(reviewId);
      if (!serverState) return;
      
      const currentOptimisticState = getReviewState(reviewId);
      if (!currentOptimisticState) return;
      
      // Determine target reaction
      let targetReaction: 'LIKE' | 'DISLIKE' | null;
      
      if (currentOptimisticState.userReaction === type) {
        // User is toggling off the same reaction
        targetReaction = null;
      } else {
        // User wants this specific reaction
        targetReaction = type;
      }
      
      // Update action queue
      actionQueue.current.set(reviewId, {
        reviewId,
        targetReaction,
        timestamp: Date.now(),
      });
      
      // Apply optimistic update immediately
      const newOptimisticState = calculateOptimisticState(serverState, targetReaction);
      setOptimisticStates(prev => new Map(prev).set(reviewId, newOptimisticState));
      
      // Clear existing timer
      const existingTimer = debounceTimers.current.get(reviewId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      // Set new debounced timer
      const timer = setTimeout(() => {
        processAction(reviewId);
        debounceTimers.current.delete(reviewId);
      }, debounceMs);
      
      debounceTimers.current.set(reviewId, timer);
    },
    [requireAuth, getServerState, getReviewState, calculateOptimisticState, processAction, debounceMs]
  );
    const cleanup = useCallback(() => {
    debounceTimers.current.forEach(timer => clearTimeout(timer));
    debounceTimers.current.clear();
    actionQueue.current.clear();
    expectedServerStates.current.clear();
    setOptimisticStates(new Map());
  }, []);
  
  return {
    handleReactToReview,
    getReviewState,
    cleanup,
  };
}
