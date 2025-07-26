'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { useUserReviews } from '@/hooks/useUserReviews';
import { useContentSummary } from '@/hooks/useContentSummary';
import UserReviewCard from '@/components/cards/userReviewCard/userReviewCard';
import styles from './reviewsTab.module.css';
import type { UserReview } from '@/constants/types/movie';
import { useReviewAction } from '@/hooks/useReviewAction';
import toast from 'react-hot-toast';
import { useReactToReview } from '@/hooks/useReactToReview';

export default function ReviewsTab() {
  const router = useRouter();
  const { username } = useStore(userStore);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = useUserReviews(username ?? '');
  const { mutate: handleReviewAction } = useReviewAction();
  const { mutate: reactToReview } = useReactToReview();
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

  const handleDeleteReview = async (
    reviewId: number,
    onSuccess?: () => void
  ) => {
    const deletePromise = new Promise<void>((resolve, reject) => {
      handleReviewAction(
        { mode: 'delete', id: reviewId },
        {
          onSuccess: () => {
            resolve();
            refetch();
            onSuccess?.();
          },
          onError: (err: any) => {
            reject(err);
          },
        }
      );
    });

    await toast.promise(
      deletePromise,
      {
        loading: 'Deleting review...',
        success: 'Review deleted!',
        error: 'Failed to delete review.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  const handleEditReview = async (
    reviewId: number,
    updatedReview: {
      title: string;
      description: string;
      rate: number;
      spoiler: boolean;
    },
    onSuccess?: () => void
  ) => {
    const updatePromise = new Promise<void>((resolve, reject) => {
      handleReviewAction(
        { mode: 'update', review: { reviewId, ...updatedReview } },
        {
          onSuccess: () => {
            resolve();
            refetch();
            onSuccess?.();
          },
          onError: (err: any) => {
            reject(err);
          },
        }
      );
    });

    await toast.promise(
      updatePromise,
      {
        loading: 'Updating review...',
        success: 'Review updated!',
        error: 'Failed to update review.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  const handleReactToReview = async (
    reviewId: number,
    type: 'LIKE' | 'DISLIKE'
  ) => {
    const reactPromise = new Promise<void>((resolve, reject) => {
      reactToReview(
        {
          reviewId,
          type,
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
        loading: 'Reacting to review...',
        success: 'Reaction recorded!',
        error: 'Failed to react to review.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  return (
    <div className={styles.reviewsContainer}>
      {reviewsLoading || !username ? (
        <p>Loading...</p>
      ) : reviewsError ? (
        <p>Error loading reviews</p>
      ) : reviewsData?.reviews.length ? (
        reviewsData.reviews.map(review => (
          <UserReviewCard
            key={review.reviewId}
            review={review}
            onClick={() => setSelectedReview(review)}
            onDelete={() => handleDeleteReview(review.reviewId)}
            onEdit={(reviewId, updatedReview) =>
              handleEditReview(reviewId, updatedReview)
            }
            onReact={handleReactToReview}
          />
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}
