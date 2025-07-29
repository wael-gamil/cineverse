'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useReactToReview } from '@/hooks/useReactToReview';
import { useAllReviews } from '@/hooks/useAllReviews';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import SkeletonReviewsList from '@/components/shared/reviewsList/skeletonReviewsList';
import type { ExtendedReview } from '@/constants/types/movie';
import { useContentSummary } from '@/hooks/useContentSummary';
import { useEffect, useState } from 'react';

type ReviewsClientWrapperProps = {
  initialReviews: ExtendedReview[];
  searchParams?: { [key: string]: string };
};

export default function ReviewsClientWrapper({
  initialReviews,
  searchParams = {},
}: ReviewsClientWrapperProps) {
  const router = useRouter();
  const [selectedReview, setSelectedReview] = useState<ExtendedReview | null>(
    null
  );
  const [isRefetching, setIsRefetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Extract parameters
  const sortBy = searchParams['sortBy'] || 'recent';
  const page = parseInt(searchParams['page'] || '1', 10) - 1;

  const { mutate: reactToReview } = useReactToReview();
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useAllReviews(page, 20, sortBy, shouldFetch);
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useContentSummary(
    selectedReview?.contentId ?? 0,
    selectedReview?.contentType ?? 'MOVIE', // Default to 'MOVIE' just to avoid TS error
    !!selectedReview // only fetch if review is selected
  );

  // Enable fetching when URL parameters change (indicating user interaction)
  useEffect(() => {
    // Check if this is not the initial load by seeing if we already have initial data
    // If URL params change after initial load, we need to fetch new data
    if (initialReviews.length > 0) {
      const currentUrlSortBy = searchParams['sortBy'] || 'recent';
      const currentUrlPage = parseInt(searchParams['page'] || '1', 10) - 1;

      // Only fetch if params don't match what would have been used for SSR
      if (currentUrlSortBy !== 'recent' || currentUrlPage !== 0) {
        setShouldFetch(true);
      }
    }
  }, [searchParams, initialReviews.length]);

  // Navigate once we have the summary
  useEffect(() => {
    if (summaryData && selectedReview) {
      const slug = summaryData.slug;
      let path = `/${slug}`;

      if (summaryData.seasonNumber)
        path += `/season/${summaryData.seasonNumber}`;
      if (summaryData.episodeNumber)
        path += `/episode/${summaryData.episodeNumber}`;

      router.push(path);
      setSelectedReview(null);
    }
  }, [summaryData, selectedReview, router]);
  // Use fetched data if available, otherwise fall back to initial data
  const reviews = reviewsData?.reviews || initialReviews;

  const handleReactToReview: (
    reviewId: number,
    type: 'LIKE' | 'DISLIKE' 
  ) => Promise<void> = async (reviewId, type) => {
    console.log('Reacting to review:', reviewId, type);
    // Find the current review to check existing reaction
    const currentReview = reviews.find(review => review.reviewId === reviewId);
    console.log('Current review:', currentReview);
    // Determine the actual type to send based on current reaction
    let actionType: 'LIKE' | 'DISLIKE' | 'UNDO' = type;
    console.log('Action type before check:', actionType);
    if (currentReview?.userReaction === type) {
      // User is clicking the same reaction again, so undo it
      actionType = 'UNDO';
    }

    const reactPromise = new Promise<void>((resolve, reject) => {
      reactToReview(
        {
          reviewId,
          type: actionType,
        },
        {
          onSuccess: () => {
            setIsRefetching(true);
            refetch().finally(() => setIsRefetching(false)); // Refetch and update loading state
            resolve();
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
          actionType === 'UNDO'
            ? 'Removing reaction...'
            : `${actionType === 'LIKE' ? 'Liking' : 'Disliking'} review...`,
        success:
          actionType === 'UNDO' ? 'Reaction removed!' : 'Reaction recorded!',
        error: 'Failed to react to review.',
      },
      {
        className: 'toast-default',
      }
    );
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <>
      {isRefetching || (shouldFetch && isLoading) ? (
        <SkeletonReviewsList />
      ) : error ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-xxl)',
            color: 'var(--color-danger)',
          }}
        >
          <p>Error loading reviews. Please try again later.</p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        reviews.map((review: ExtendedReview) => (
          <ExtendedReviewCard
            key={review.reviewId}
            review={review}
            onReact={handleReactToReview}
            onUserClick={handleUserClick}
            onContentClick={() => setSelectedReview(review)}
          />
        ))
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-xxl)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-muted)',
          }}
        >
          <p>No reviews found. Be the first to write a review!</p>
        </div>
      )}
    </>
  );
}
