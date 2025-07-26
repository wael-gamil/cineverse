'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useReactToReview } from '@/hooks/useReactToReview';
import { useAllReviews } from '@/hooks/useAllReviews';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import type { ExtendedReview } from '@/constants/types/movie';
import { useContentSummary } from '@/hooks/useContentSummary';
import { useEffect, useState } from 'react';

type ReviewsClientWrapperProps = {
  initialReviews: ExtendedReview[];
};

export default function ReviewsClientWrapper({
  initialReviews,
}: ReviewsClientWrapperProps) {
  const router = useRouter();
  const [selectedReview, setSelectedReview] = useState<ExtendedReview | null>(
    null
  );
  const { mutate: reactToReview } = useReactToReview();
  const { data: reviewsData, isLoading, error, refetch } = useAllReviews(0, 20);
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useContentSummary(
    selectedReview?.contentId ?? 0,
    selectedReview?.contentType ?? 'MOVIE', // Default to 'MOVIE' just to avoid TS error
    !!selectedReview // only fetch if review is selected
  );

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
    const reactPromise = new Promise<void>((resolve, reject) => {
      reactToReview(
        {
          reviewId,
          type,
        },
        {
          onSuccess: () => {
            refetch(); // Refetch the reviews to get updated counts
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
        loading: 'Reacting to review...',
        success: 'Reaction recorded!',
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
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading reviews</p>
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
        <p>No reviews found.</p>
      )}
    </>
  );
}
