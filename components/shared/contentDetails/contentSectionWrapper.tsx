'use client';

import { useRef } from 'react';
import styles from './contentSectionWrapper.module.css';
import { useIsInViewOnce } from '@/hooks/useIsInViewOnce';
import CreditsSection from './creditsSection/creditsSection';
import CreditsSkeleton from './creditsSection/creditsSkeleton';
import ReviewsSection from './reviewsSection/reviewsSection';
import ReviewsSkeleton from './reviewsSection/reviewsSkeleton';
import SeasonsSection from './seasonsSection/seasonsSection';
import SeasonsSkeleton from './seasonsSection/seasonsSkeleton';
import { Credits, Review, Season, Series } from '@/constants/types/movie';

import { useContentSectionQuery } from '@/hooks/useContentSectionQuery';
import EpisodesSection from './seasonsSection/episodeSection';
import EpisodeSkeleton from './seasonsSection/episodeSkeleton';

type SectionType = 'credits' | 'seasons' | 'reviews' | 'episodes';

type ContentSectionWrapperProps = {
  section: SectionType;
  id: number; // this is seriesId
  seasonNumber?: number; // new optional prop
  fallbackPoster?: string;
  seasonsData?: Season[];
};

export default function ContentSectionWrapper({
  section,
  id,
  seasonNumber,
  fallbackPoster,
  seasonsData,
}: ContentSectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsInViewOnce(ref, '300px', 0.6);
  const { data, isLoading } = useContentSectionQuery(
    section,
    id,
    isVisible,
    seasonNumber
  );
  if (!isVisible) {
    return <div ref={ref} className={styles.fakeContainer} />;
  }

  if (isLoading || !data) {
    return (
      <div ref={ref}>
        {section === 'credits' && <CreditsSkeleton />}
        {section === 'seasons' && <SeasonsSkeleton />}
        {section === 'reviews' && <ReviewsSkeleton />}
        {section === 'episodes' && <EpisodeSkeleton />}
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
    case 'episodes':
      return (
        <EpisodesSection
          seasonNumber={seasonNumber!}
          seriesId={id}
          fallbackPoster={fallbackPoster}
          seasonsData={seasonsData ?? []}
          episodesData={data}
        />
      );
    default:
      return null;
  }
}
