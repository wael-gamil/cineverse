'use client';

import styles from './searchResult.module.css';
import SkeletonCard from '../../cards/card/skeletonCard';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type Props = {
  count?: number;
};

export default function SearchResultSkeleton({ count = 12 }: Props) {
  const isMobile = useResponsiveLayout();
  return (
    <div className={styles.results}>
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={count}
        scrollRows={isMobile ? 1 : undefined}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonCard
            key={idx}
            layout={isMobile ? 'below' : 'overlay'}
            imageHeight='image-lg'
            minWidth={250}
            maxWidth={500}
          />
        ))}
      </GridContainer>
    </div>
  );
}
