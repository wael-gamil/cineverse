'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './reviewsSection.module.css';
import { Review, ExtendedReview } from '@/constants/types/movie';
import Button from '../../../ui/button/button';
import { Icon } from '../../../ui/icon/icon';
import ExtendedReviewCard from '../../../cards/extendedReviewCard/extendedReviewCard';
import AddReviewPopup from './addReviewPopup';
import { useAddReviewMutation } from '@/hooks/useAddReviewMutation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useReviewReactionHandler } from '@/hooks/useReviewReactionHandler';
import { useIsInView } from '@/hooks/useIsInView';

type ReviewsSectionProps = {
  data: Review[];
  contentId: number;
  contentTitle: string;
  contentPoster?: string;
  refetch: () => void;
};

export default function ReviewsSection({
  data,
  contentId,
  contentTitle,
  contentPoster,
  refetch,
}: ReviewsSectionProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { requireAuth } = useAuth();
  const reviewsRef = useRef<HTMLElement>(null);
  const isInView = useIsInView(reviewsRef, '50px', 0.3);

  const router = useRouter();
  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const mostHelpfulReview = data[0];
  const otherReviews = data.slice(1);
  // Convert Review to ExtendedReview format for ExtendedReviewCard
  const convertToExtendedReview = (review: Review): ExtendedReview => ({
    ...review,
    user: {
      ...review.user,
      username:
        review.user.name?.toLowerCase().replace(/\s+/g, '') ||
        review.user.username,
    },
    contentId: 0,
    contentType: 'MOVIE' as const,
    contentTitle: '',
    contentPosterUrl: '',
  });
  const handleAddReview = () => {
    requireAuth(() => {
      setIsPopupOpen(true);
    }, 'Please log in to write a review');
  };
  const { mutate: postReview, isPending } = useAddReviewMutation();
  // Set up reaction handler with debouncing and optimistic updates
  const { handleReactToReview, getReviewState } = useReviewReactionHandler({
    reviews: data,
  });

  const handleSubmitReview = async (
    reviewData: {
      contentId: number;
      rate: number;
      title: string;
      description: string;
      spoiler: boolean;
    },
    onClose: () => void,
    resetForm: () => void
  ) => {
    const submitPromise = new Promise<void>((resolve, reject) => {
      postReview(reviewData, {
        onSuccess: () => {
          resolve();
          refetch();
        },
        onError: (err: any) => {
          reject(err.message || 'Something went wrong');
        },
      });
    });

    resetForm();
    onClose();

    await toast.promise(
      submitPromise,
      {
        loading: 'Posting review...',
        success: 'Review posted!',
        error: err =>
          typeof err === 'string' ? err : 'Failed to post review.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  return (
    <>
      <section
        ref={reviewsRef}
        className={`${styles.section} ${isInView ? 'lightMode' : ''}`}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.heading}>
            <h2>Reviews</h2>
            <p>{data.length} reviews</p>
          </div>
          <Button onClick={handleAddReview}>
            <Icon name='PlusCircle' strokeColor='white' />
            Add Your Review
          </Button>
        </div>

        <div className={styles.container}>
          {/* Most Helpful Review */}
          {mostHelpfulReview && (
            <div className={styles.cardWrapper}>
              <h3>Most Helpful Review</h3>
              <ExtendedReviewCard
                review={convertToExtendedReview(
                  getReviewState(mostHelpfulReview.reviewId) ||
                    mostHelpfulReview
                )}
                showUserInfo={true}
                showContentInfo={false}
                onReact={(id: number, type: 'LIKE' | 'DISLIKE') =>
                  handleReactToReview(id, type)
                }
                onUserClick={() =>
                  handleUserClick(mostHelpfulReview.user.username)
                }
              />
            </div>
          )}
          {/* Other Reviews */}
          {otherReviews.length > 0 && (
            <div className={styles.cardWrapper}>
              <h3>All Reviews ({otherReviews.length})</h3>{' '}
              <div className={styles.reviewList}>
                {otherReviews.map((review, index) => {
                  const reviewState = getReviewState(review.reviewId);
                  return (
                    <ExtendedReviewCard
                      review={convertToExtendedReview(reviewState || review)}
                      key={index}
                      showUserInfo={true}
                      showContentInfo={false}
                      onReact={(id: number, type: 'LIKE' | 'DISLIKE') =>
                        handleReactToReview(id, type)
                      }
                      onUserClick={() => handleUserClick(review.user.username)}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {/* Empty State */}
          {data.length === 0 && (
            <div className={styles.empty}>
              <Icon
                name='MessageSquare'
                strokeColor='white'
                width={40}
                height={40}
              />
              <div className={styles.text}>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your thoughts about this content.</p>
              </div>
              <Button variant='ghost' color='neutral' onClick={handleAddReview}>
                <Icon name='PlusCircle' strokeColor='white' />
                Write the First Review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Add Review Popup */}
      <AddReviewPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        contentId={contentId}
        contentTitle={contentTitle}
        contentPoster={contentPoster}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
