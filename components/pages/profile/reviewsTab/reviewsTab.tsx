'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { useUserReviews } from '@/hooks/useUserReviews';
import { useContentSummary } from '@/hooks/useContentSummary';
import ExtendedReviewCard from '@/components/cards/extendedReviewCard/extendedReviewCard';
import SkeletonProfileReviewCard from './skeletonProfileReviewCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import styles from './reviewsTab.module.css';
import type { UserReview } from '@/constants/types/movie';
import { useReviewAction } from '@/hooks/useReviewAction';
import toast from 'react-hot-toast';
import { useReactToReview } from '@/hooks/useReactToReview';
import { useAuth } from '@/hooks/useAuth';

export default function ReviewsTab() {
  const router = useRouter();
  const { username } = useStore(userStore);
  const { requireAuth } = useAuth();
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    rate: 1,
    spoiler: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

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
      setEditFormData(currentReview);
      setIsEditModalOpen(true);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingReview) return;

    setIsSubmitting(true);
    const updatePromise = new Promise<void>((resolve, reject) => {
      handleReviewAction(
        {
          mode: 'update',
          review: { reviewId: editingReview.reviewId, ...editFormData },
        },
        {
          onSuccess: () => {
            resolve();
            refetch();
            setIsEditModalOpen(false);
            setEditingReview(null);
          },
          onError: (err: any) => {
            reject(err);
          },
        }
      );
    });

    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReactToReview = async (
    reviewId: number,
    type: 'LIKE' | 'DISLIKE'
  ) => {
    if (!requireAuth(undefined, 'Please log in to react to reviews')) {
      return;
    }

    // Find the current review to check existing reaction
    const currentReview = reviewsData?.reviews.find(
      review => review.reviewId === reviewId
    );

    // Determine the actual type to send based on current reaction
    let actionType: 'LIKE' | 'DISLIKE' | 'UNDO' = type;

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
  return (
    <>
      <div className={styles.reviewsContainer}>
        {reviewsLoading || !username ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonProfileReviewCard key={index} />
            ))}
          </>
        ) : reviewsError ? (
          <p>Error loading reviews</p>
        ) : reviewsData?.reviews.length ? (
          reviewsData.reviews.map(review => (
            <ExtendedReviewCard
              key={review.reviewId}
              review={review}
              showUserInfo={false}
              onContentClick={() => setSelectedReview(review)}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              onReact={handleReactToReview}
            />
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingReview && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Review</h2>
              <Button
                variant='ghost'
                color='neutral'
                padding='sm'
                borderRadius='fullRadius'
                onClick={() => setIsEditModalOpen(false)}
              >
                <Icon name='close' strokeColor='white' />
              </Button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmitEdit();
              }}
              className={styles.editForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor='reviewTitle' className={styles.formLabel}>
                  Review Title
                </label>
                <input
                  id='reviewTitle'
                  type='text'
                  value={editFormData.title}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className={styles.formInput}
                  required
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='reviewDescription' className={styles.formLabel}>
                  Review Description
                </label>
                <textarea
                  id='reviewDescription'
                  value={editFormData.description}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={styles.formTextarea}
                  required
                  maxLength={1000}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rating</label>
                <div className={styles.ratingInput}>
                  <div className={styles.interactiveStars}>
                    {Array.from({ length: 10 }).map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <span
                          key={i}
                          onClick={() =>
                            setEditFormData(prev => ({
                              ...prev,
                              rate: starValue,
                            }))
                          }
                          className={styles.starWrapperInteractive}
                        >
                          <Icon
                            name='starFilled'
                            className={
                              editFormData.rate >= starValue
                                ? styles.starFilledInteractive
                                : styles.starEmptyInteractive
                            }
                          />
                        </span>
                      );
                    })}
                  </div>
                  <span className={styles.rateNumber}>
                    {editFormData.rate}/10
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    checked={editFormData.spoiler}
                    onChange={e =>
                      setEditFormData(prev => ({
                        ...prev,
                        spoiler: e.target.checked,
                      }))
                    }
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Contains Spoilers</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <Button
                  type='button'
                  variant='ghost'
                  color='neutral'
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='solid'
                  color='primary'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingReviewId && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className={styles.deleteModalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.deleteModalHeader}>
              <Icon name='alertTriangle' className={styles.warningIcon} />
              <h2 className={styles.deleteModalTitle}>Delete Review</h2>
            </div>

            <div className={styles.deleteModalBody}>
              <p className={styles.deleteModalText}>
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
              {(() => {
                const reviewToDelete = reviewsData?.reviews.find(
                  r => r.reviewId === deletingReviewId
                );
                return reviewToDelete ? (
                  <div className={styles.reviewPreview}>
                    <strong>"{reviewToDelete.title}"</strong>
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
            </div>

            <div className={styles.deleteModalActions}>
              <Button
                type='button'
                variant='ghost'
                color='neutral'
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='solid'
                color='danger'
                onClick={handleConfirmDelete}
              >
                Delete Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
