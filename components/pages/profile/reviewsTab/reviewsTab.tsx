'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { useUserReviews } from '@/hooks/useUserReviews';
import { useContentSummary } from '@/hooks/useContentSummary';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import SkeletonProfileReviewCard from './skeletonProfileReviewCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import Pagination from '@/components/ui/pagination/pagination';
import DeleteConfirmationModal from '@/components/ui/deleteConfirmationModal/deleteConfirmationModal';
import styles from './reviewsTab.module.css';
import type { UserReview } from '@/constants/types/movie';
import { useReviewAction } from '@/hooks/useReviewAction';
import toast from 'react-hot-toast';
import { useReviewReactionHandler } from '@/hooks/useReviewReactionHandler';
import { useAuth } from '@/hooks/useAuth';
import AddReviewPopup from '@/components/shared/contentDetails/reviewsSection/addReviewPopup';

export default function ReviewsTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1; // Convert to 0-based index
  const { username } = useStore(userStore);
  const { requireAuth } = useAuth();
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = useUserReviews(username ?? '', page, 5, !!username);

  const { mutate: handleReviewAction } = useReviewAction();
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

  const handleDeleteReview = (reviewId: number) => {
    setDeletingReviewId(reviewId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReviewId) return;

    const deletePromise = new Promise<void>((resolve, reject) => {
      handleReviewAction(
        { mode: 'delete', id: deletingReviewId },
        {
          onSuccess: () => {
            resolve();
            refetch();
            setIsDeleteModalOpen(false);
            setDeletingReviewId(null);
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

  const handleEditReview = (
    reviewId: number,
    currentReview: {
      title: string;
      description: string;
      rate: number;
      spoiler: boolean;
    }
  ) => {
    const review = reviewsData?.reviews.find(r => r.reviewId === reviewId);
    if (review) {
      setEditingReview(review);
      setIsEditModalOpen(true);
    }
  };

  // Updated submit handler to work with the unified modal
  const handleReviewSubmit = async (
    reviewData: any,
    onClose: () => void,
    resetForm: () => void
  ) => {
    const updatePromise = new Promise<void>((resolve, reject) => {
      handleReviewAction(
        {
          mode: 'update',
          review: reviewData,
        },
        {
          onSuccess: () => {
            resolve();
            refetch();
            onClose();
            setEditingReview(null);
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

  return (
    <>
      <div className={styles.reviewsContainer}>
        {reviewsLoading || !username ? (
          <div className={styles.profileReviewsList}>
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonProfileReviewCard key={index} />
            ))}
          </div>
        ) : reviewsError ? (
          <div className={styles.errorContainer}>
            <Icon
              name='alertTriangle'
              strokeColor='danger'
              width={48}
              height={48}
            />
            <h3>Error loading reviews</h3>
            <p>Please try again later.</p>
          </div>
        ) : reviewsData?.reviews.length ? (
          reviewsData.reviews.map(review => {
            const reviewState = getReviewState(review.reviewId);
            return (
              <ExtendedReviewCard
                key={review.reviewId}
                review={reviewState || review}
                showUserInfo={false}
                onContentClick={() => setSelectedReview(review)}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onReact={handleReactToReview}
              />
            );
          })
        ) : (
          <div className={styles.emptyContainer}>
            <Icon name='star' strokeColor='muted' width={48} height={48} />
            <h3>No reviews yet</h3>
            <p>
              You haven't written any reviews yet. Start sharing your thoughts
              about movies and TV shows!
            </p>
          </div>
        )}
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

      {/* Unified Edit Modal using AddReviewPopup */}
      {isEditModalOpen && editingReview && (
        <AddReviewPopup
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReview(null);
          }}
          contentId={editingReview.contentId}
          contentTitle={editingReview.contentTitle}
          onSubmit={handleReviewSubmit}
          mode='edit'
          initialData={{
            reviewId: editingReview.reviewId,
            title: editingReview.title,
            description: editingReview.description,
            rate: editingReview.rate,
            spoiler: editingReview.spoiler,
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen && !!deletingReviewId}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Review'
        message='Are you sure you want to delete this review? This action cannot be undone.'
        itemPreview={(() => {
          const reviewToDelete = reviewsData?.reviews.find(
            r => r.reviewId === deletingReviewId
          );
          return reviewToDelete ? (
            <div className={styles.reviewPreview}>
              <strong>"{reviewToDelete.title}" </strong>
              <span className={styles.reviewMeta}>
                for {reviewToDelete.contentTitle} •{' '}
                {new Date(reviewToDelete.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>
          ) : null;
        })()}
        confirmText='Delete Review'
      />
    </>
  );
}
