import styles from './page.module.css';
import { getAllReviewsSSR } from '@/lib/api';
import TopReviewersSidebar from './topReviewersSidebar';
import ReviewsClientWrapper from './reviewsClientWrapper';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import ReviewsFilters from './reviewsFilters';

export default async function Reviews() {
  const { reviews } = await getAllReviewsSSR(0, 20);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <SectionHeader
            title="Reviews"
            subtitle="Discover what others are saying about your favorite movies and TV shows"
            variant="lined"
            filterTabs={<ReviewsFilters />}
          />
        </div>
        <div className={styles.reviewsList}>
          <ReviewsClientWrapper initialReviews={reviews || []} />
        </div>
      </div>
      <TopReviewersSidebar />
    </div>
  );
}
