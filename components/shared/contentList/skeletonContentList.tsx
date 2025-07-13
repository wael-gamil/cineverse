'use client';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import GridContainer from '@/components/shared/gridContainer/gridContainer';

export default function SkeletonContentList() {
  const isMobile = useResponsiveLayout();
  return (
    <GridContainer
      layout='grid'
      cardGap={26}
      cardMinWidth={250}
      scrollRows={isMobile ? 1 : undefined}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonCard
          key={index}
          imageHeight='image-lg'
          layout={isMobile ? 'below' : 'overlay'}
          maxWidth={500}
          minWidth={250}
        />
      ))}
    </GridContainer>
  );
}
