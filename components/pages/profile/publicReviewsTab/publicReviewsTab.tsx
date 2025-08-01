'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContentSummary } from '@/hooks/useContentSummary';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import SkeletonProfileReviewCard from '../reviewsTab/skeletonProfileReviewCard';
import { Icon } from '@/components/ui/icon/icon';
import styles from '../reviewsTab/reviewsTab.module.css';
import type { UserReview } from '@/constants/types/movie';
import { useReactToReview } from '@/hooks/useReactToReview';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { usePublicUserReviews } from '@/hooks/usePublicUserReviews';
import { useUserReviews } from '@/hooks/useUserReviews';

type PublicReviewsTabProps = {
  username: string;
};

export default function PublicReviewsTab({ username }: PublicReviewsTabProps) {
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useAuth();
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);

  // Use different hooks based on login status
  const publicReviewsQuery = usePublicUserReviews({
    username,
  });

  const userReviewsQuery = useUserReviews(username);

  // Choose the appropriate query based on login status
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = isAuthenticated ? userReviewsQuery : publicReviewsQuery;

  const { mutate: reactToReview } = useReactToReview();
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useContentSummary(
    selectedReview?.contentId ?? 0,
    selectedReview?.contentType ?? 'MOVIE',
    !!selectedReview
  );

  // Navigate once we have the summary
  useEffect(() => {
    if (summaryData && selectedReview) {
      const slug = summaryData.slug;
      let path = `/${slug}`;

      if (summaryData.seasonNumber)
        path += `/seasons/${summaryData.seasonNumber}`;
      if (summaryData.episodeNumber)
        path += `/episodes/${summaryData.episodeNumber}`;

      router.push(path);
      setSelectedReview(null);
    }
  }, [summaryData, selectedReview, router]);

  const handleReactToReview = async (
    reviewId: number,
    type: 'LIKE' | 'DISLIKE'
  ) => {
    if (!requireAuth(undefined, 'Please log in to react to reviews')) {
      return;
    }

    const currentReview = reviewsData?.reviews.find(
      review => review.reviewId === reviewId
    );
    let actionType: 'LIKE' | 'DISLIKE' | 'UNDO' = type;
    if (currentReview?.userReaction === type) {
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
            refetch();
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

  const handleUserClick = (clickedUsername: string) => {
    router.push(`/profile/${clickedUsername}`);
  };

  if (reviewsLoading) {
    return (
      <div className={styles.profileReviewsList}>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonProfileReviewCard key={i} />
        ))}
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className={styles.errorContainer}>
        <Icon name='alertTriangle' strokeColor='danger' />
        <h3>Error loading reviews</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!reviewsData?.reviews?.length) {
    return (
      <div className={styles.emptyContainer}>
        <Icon name='star' strokeColor='muted' width={48} height={48} />
        <h3>No reviews yet</h3>
        <p>{username} hasn't written any reviews.</p>
      </div>
    );
  }
  return (
    <div className={styles.reviewsContainer}>
      {reviewsData.reviews.map((review: UserReview) => (
        <ExtendedReviewCard
          key={review.reviewId}
          review={review}
          showUserInfo={false} // Don't show user info on profile page
          onContentClick={() => setSelectedReview(review)}
          onReact={handleReactToReview}
          // Don't pass onEdit or onDelete to hide edit/delete actions for public view
        />
      ))}
    </div>
  );
}
