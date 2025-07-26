'use client';

import { useState } from 'react';
import styles from './reviewsSection.module.css';
import { Review } from '@/constants/types/movie';
import Link from 'next/link';
import Button from '../../../ui/button/button';
import { Icon } from '../../../ui/icon/icon';
import ReviewCard from '../../../cards/reviewCard/reviewCard';
import AddReviewPopup from './addReviewPopup';
import { useAddReviewMutation } from '@/hooks/useAddReviewMutation';
import toast from 'react-hot-toast';
import { useReactToReview } from '@/hooks/useReactToReview';

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
  const mostHelpfulReview = data[0];
  const otherReviews = data.slice(1);
  console.log('content id:', contentId);

  const handleAddReview = () => {
    setIsPopupOpen(true);
  };
  const { mutate: postReview, isPending } = useAddReviewMutation();
  const { mutate: reactToReview } = useReactToReview();

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
        loading: 'Sending reaction...',
        success: 'Thanks for your feedback!',
        error: 'Failed to send reaction.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  return (
    <>
      <section className={styles.section}>
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
              <ReviewCard
                review={mostHelpfulReview}
                onReact={(id, type) => handleReactToReview(id, type)}
              />
            </div>
          )}

          {/* Other Reviews */}
          {otherReviews.length > 0 && (
            <div className={styles.cardWrapper}>
              <h3>All Reviews ({otherReviews.length})</h3>
              <div className={styles.reviewList}>
                {otherReviews.map((review, index) => (
                  <ReviewCard
                    review={review}
                    key={index}
                    onReact={(id, type) => handleReactToReview(id, type)}
                  />
                ))}
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
