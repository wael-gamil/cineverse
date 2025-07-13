'use client';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import styles from './creditsSection.module.css';
import skeletonStyles from './creditsSkeleton.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

export default function CreditsSkeleton() {
  const isMobile = useResponsiveLayout();
  return (
    <section className={styles.section}>
      {/* Section Header Skeleton */}
      <div className={styles.sectionHeader}>
        <div className={skeletonStyles.skeletonHeading} />
      </div>

      {/* Credits Grid Skeleton */}
      <GridContainer layout='grid' cardMinWidth={270} scrollRows={1}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard
            key={i}
            imageHeight='image-lg'
            layout='below'
            maxWidth={400}
            minWidth={270}
          />
        ))}
      </GridContainer>
    </section>
  );
}
