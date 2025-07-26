// components/shared/watchlist/watchlistSkeleton.tsx
'use client';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import GridContainer from '@/components/shared/gridContainer/gridContainer';

export default function WatchlistSkeleton() {
  const placeholders = Array.from({ length: 8 });

  return (
    <GridContainer
      layout='grid'
      cardGap={26}
      cardMinWidth={250}
      cardMaxWidth={500}
      cardCount={8}
    >
      {placeholders.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </GridContainer>
  );
}
