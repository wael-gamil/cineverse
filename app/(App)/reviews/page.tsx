import styles from './page.module.css';
import { getAllReviews } from '@/lib/api';
import type { ExtendedReview } from '@/constants/types/movie';
import TopReviewersSidebar from './topReviewersSidebar';
import ReviewsClientWrapper from './reviewsClientWrapper';

export default async function Reviews() {
  const { reviews } = await getAllReviews(0, 20);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Reviews</h1>
        <div className={styles.reviewsList}>
          <ReviewsClientWrapper initialReviews={reviews || []} />
        </div>
      </div>
      <TopReviewersSidebar />
    </div>
  );
}
