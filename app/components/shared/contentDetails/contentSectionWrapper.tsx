'use client';

import { useRef } from 'react';
import styles from './contentSectionWrapper.module.css';
import { useIsInViewOnce } from '@/app/hooks/useIsInView';
import CreditsSection from './creditsSection/creditsSection';
import CreditsSkeleton from './creditsSection/creditsSkeleton';
import ReviewsSection from './reviewsSection/reviewsSection';
import ReviewsSkeleton from './reviewsSection/reviewsSkeleton';
import SeasonsSection from './seasonsSection/seasonsSection';
import SeasonsSkeleton from './seasonsSection/seasonsSkeleton';
import { Credits, Review, Season, Series } from '@/app/constants/types/movie';

import { useContentSectionQuery } from '@/app/hooks/useContentSectionQuery';

type SectionType = 'credits' | 'seasons' | 'reviews';

type ContentSectionWrapperProps = {
  section: SectionType;
  id: number;
  seriesData?: Series;
};

export default function ContentSectionWrapper({
  section,
  id,
}: ContentSectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsInViewOnce(ref, '0px', 0.6);
  const { data, isLoading } = useContentSectionQuery(section, id, isVisible);

  if (!isVisible) {
    return <div ref={ref} className={styles.fakeContainer} />;
  }

  if (isLoading || !data) {
    return (
      <div ref={ref}>
        {section === 'credits' && <CreditsSkeleton />}
        {section === 'seasons' && <SeasonsSkeleton />}
        {section === 'reviews' && <ReviewsSkeleton />}
      </div>
    );
  }
  switch (section) {
    case 'credits':
      return <CreditsSection data={data as Credits} />;
    case 'seasons':
      return <SeasonsSection data={data as Season[]} seriesId={id} />;
    case 'reviews':
      return <ReviewsSection data={data as Review[]} />;
    default:
      return null;
  }
}
