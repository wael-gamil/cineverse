'use client';

import { useRef } from 'react';
import { useIsInViewOnce } from '@/hooks/useIsInViewOnce';
import { useSliderQuery } from '@/hooks/useSliderQuery';
import ContentSliderSection from './contentSliderSection';
import ContentSliderSkeleton from './contentSliderSkeleton';
import { CardProps } from '@/components/cards/card/card';

type FilterType = 'ALL' | 'MOVIE' | 'SERIES';
type HeaderVariant = 'block' | 'strip' | 'lined' | 'ghost';

type WrapperProps = {
  title: string;
  fetchUrl: string;
  initialFilter?: FilterType;
  showAllFilter?: boolean;
  header?: {
    variant?: HeaderVariant;
    subtitle?: string;
    icon?: React.ReactNode;
  };
  cardProps?: Partial<
    Omit<
      CardProps,
      'title' | 'imageUrl' | 'description' | 'subtitle' | 'href' | 'badges'
    >
  >;
};

export default function ContentSliderSectionWrapper({
  title,
  fetchUrl,
  initialFilter = 'ALL',
  showAllFilter = true,
  header,
  cardProps,
}: WrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsInViewOnce(ref, '100px', 0.4);

  const { data, isLoading } = useSliderQuery(
    fetchUrl,
    title,
    0,
    initialFilter,
    isVisible
  );
  if (!isVisible) {
    return <div ref={ref} style={{ height: '300px' }} />;
  }

  if (isLoading || !data) {
    return (
      <ContentSliderSkeleton
        title={title}
        cardsPerView={6}
        layout={cardProps?.layout}
        imageHeight={cardProps?.imageHeight}
        minWidth={cardProps?.minWidth}
        maxWidth={cardProps?.maxWidth}
        header={header}
      />
    );
  }
  return (
    <ContentSliderSection
      title={title}
      initialFilter={initialFilter}
      showAllFilter={showAllFilter}
      initialData={data.content}
      fetchUrl={fetchUrl}
      header={header}
      cardProps={cardProps}
    />
  );
}
