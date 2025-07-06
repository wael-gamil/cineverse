import styles from './creditsSection.module.css';
import skeletonStyles from './creditsSkeleton.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';

export default function CreditsSkeleton() {
  return (
    <section className={styles.section}>
      {/* Section Header Skeleton */}
      <div className={styles.sectionHeader}>
        <div className={skeletonStyles.skeletonHeading} />
      </div>

      {/* Credits Grid Skeleton */}
      <div className={styles.creditsGrid}>
        <SkeletonCard
          imageHeight='image-lg'
          layout='below'
          minWidth={220}
          maxWidth={250}
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard
            key={i}
            imageHeight='image-lg'
            layout='below'
            minWidth={220}
            maxWidth={250}
          />
        ))}
      </div>
    </section>
  );
}
