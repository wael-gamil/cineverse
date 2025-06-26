'use client';

import styles from './reviewsSection.module.css';
import { Review } from '@/app/constants/types/movie';
import Link from 'next/link';
import Button from '../../../ui/button/button';
import { Icon } from '../../../ui/icon/icon';
import ReviewCard from '../../../cards/reviewCard/reviewCard';

type ReviewsSectionProps = {
  data: Review[];
};

export default function ReviewsSection({ data }: ReviewsSectionProps) {
  const mostHelpfulReview = data[0];
  const otherReviews = data.slice(1);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.heading}>
          <h2>Reviews</h2>
          <p>{data.length} reviews</p>
        </div>
        <Button>
          <Icon name='PlusCircle' strokeColor='white' />
          Add Your Review
        </Button>
      </div>

      <div className={styles.container}>
        {/* Most Helpful Review */}
        {mostHelpfulReview && (
          <div className={styles.cardWrapper}>
            <h3>Most Helpful Review</h3>
            <ReviewCard review={mostHelpfulReview} />
          </div>
        )}

        {/* Other Reviews */}
        {otherReviews.length > 0 && (
          <div className={styles.cardWrapper}>
            <h3>All Reviews ({otherReviews.length})</h3>
            <div className={styles.reviewList}>
              {otherReviews.map((review, index) => (
                <ReviewCard review={review} key={index} />
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
            <Button variant='ghost' color='neutral'>
              <Icon name='PlusCircle' strokeColor='white' />
              Write the First Review
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
