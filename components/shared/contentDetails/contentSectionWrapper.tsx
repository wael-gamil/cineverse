'use client';

import { useRef, useState } from 'react';
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
  id: number;
  seasonNumber?: number;
  fallbackPoster?: string;
  seasonsData?: Season[];
  contentTitle?: string;
  contentPoster?: string;
  sortBy?: string;
};

export default function ContentSectionWrapper({
  section,
  id,
  seasonNumber,
  fallbackPoster,
  seasonsData,
  contentTitle,
  contentPoster,
  sortBy,
}: ContentSectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsInViewOnce(ref, '300px', 0.6);

  // Only for reviews section: manage sort and pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSort, setCurrentSort] = useState(sortBy || 'likes');
  const pageSize = 5;

  // Fetch reviews with pagination and sort
  const { data, isLoading, refetch } = useContentSectionQuery(
    section,
    id,
    isVisible,
    seasonNumber,
    section === 'reviews' ? currentSort : undefined,
    section === 'reviews' ? currentPage : undefined,
    section === 'reviews' ? pageSize : undefined
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
    case 'reviews': {
      // Data shape: { reviews, totalPages, currentPage }
      const {
        reviews = [],
        totalPages = 1,
        currentPage: page = 0,
      } = data || {};
      return (
        <ReviewsSection
          data={reviews}
          contentId={id}
          contentTitle={contentTitle ?? ''}
          contentPoster={contentPoster}
          refetch={refetch}
          sortBy={currentSort}
          setSortBy={setCurrentSort}
          currentPage={page}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      );
    }
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
