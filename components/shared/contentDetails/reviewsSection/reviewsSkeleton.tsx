import SkeletonExtendedReviewCard from '@/components/cards/extendedReviewCard/skeletonExtendedReviewCard';
import styles from './reviewsSection.module.css';
import skeletonStyles from './reviewsSkeleton.module.css';

export default function ReviewsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.heading}>
          <div className={skeletonStyles.skeletonHeading} />
          <div className={skeletonStyles.skeletonSubheading} />
        </div>
        <div className={skeletonStyles.skeletonButton} />
      </div>

      <div className={styles.container}>
        {/* Most Helpful Review Skeleton */}
        <div className={styles.cardWrapper}>
          <div className={skeletonStyles.skeletonSectionTitle} />
          <SkeletonExtendedReviewCard
            showUserInfo={true}
            showContentInfo={false}
          />
        </div>

        {/* Other Reviews Skeleton */}
        <div className={styles.cardWrapper}>
          <div className={skeletonStyles.skeletonSectionTitle} />
          <div className={styles.reviewList}>
            <SkeletonExtendedReviewCard
              showUserInfo={true}
              showContentInfo={false}
            />
            <SkeletonExtendedReviewCard
              showUserInfo={true}
              showContentInfo={false}
            />
            <SkeletonExtendedReviewCard
              showUserInfo={true}
              showContentInfo={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
