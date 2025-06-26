import styles from './reviewsSection.module.css';
import skeletonStyles from './reviewsSkeleton.module.css';
import SkeletonReviewCard from '@/components/cards/reviewCard/skeletonReviewCard';

export default function ReviewsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={skeletonStyles.skeletonHeading} />
        <div className={skeletonStyles.skeletonHeading} />
      </div>

      <div className={styles.container}>
        <SkeletonReviewCard />
        <SkeletonReviewCard />
        <SkeletonReviewCard />
      </div>
    </section>
  );
}
