'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContentSummary } from '@/hooks/useContentSummary';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import SkeletonProfileReviewCard from '../reviewsTab/skeletonProfileReviewCard';
import { Icon } from '@/components/ui/icon/icon';
import Pagination from '@/components/ui/pagination/pagination';
import styles from '../reviewsTab/reviewsTab.module.css';
import type { UserReview } from '@/constants/types/movie';
import { useReviewReactionHandler } from '@/hooks/useReviewReactionHandler';
import { useAuth } from '@/hooks/useAuth';
import { usePublicUserReviews } from '@/hooks/usePublicUserReviews';
import { useUserReviews } from '@/hooks/useUserReviews';

type PublicReviewsTabProps = {
  username: string;
};

export default function PublicReviewsTab({ username }: PublicReviewsTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1; // Convert to 0-based index
  const { requireAuth, isAuthenticated } = useAuth();
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);

  // Use different hooks based on login status
  const publicReviewsQuery = usePublicUserReviews({
    username,
    page,
    size: 10,
  });

  const userReviewsQuery = isAuthenticated
    ? useUserReviews(username, page, 10, !!username)
    : null;

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = isAuthenticated ? userReviewsQuery! : publicReviewsQuery;
  // Set up reaction handler with debouncing and optimistic updates
  const { handleReactToReview, getReviewState } = useReviewReactionHandler({
    reviews: reviewsData?.reviews || [],
  });

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
    <>
      <div className={styles.reviewsContainer}>
        {reviewsData.reviews.map((review: UserReview) => {
          const reviewState = getReviewState(review.reviewId);
          return (
            <ExtendedReviewCard
              key={review.reviewId}
              review={reviewState || review}
              showUserInfo={false} // Don't show user info on profile page
              onContentClick={() => setSelectedReview(review)}
              onReact={handleReactToReview}
              // Don't pass onEdit or onDelete to hide edit/delete actions for public view
            />
          );
        })}
      </div>

      {/* Pagination */}
      {reviewsData?.reviews.length !== 0 &&
        reviewsData?.totalPages &&
        reviewsData.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={reviewsData.currentPage}
              totalPages={reviewsData.totalPages}
            />
          </div>
        )}
    </>
  );
}
