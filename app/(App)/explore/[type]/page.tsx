import ContentListWrapper from '@/components/shared/contentList/contentListWrapper';
import { notFound } from 'next/navigation';
import Filter from '@/components/ui/filter/filter';
import Sort from '@/components/ui/sort/sort';
import { getFilterOptions } from '@/lib/api';
import styles from '../page.module.css';
import { FilterOpt } from '@/constants/types/movie';
import { Suspense } from 'react';
import SkeletonContentList from '@/components/shared/contentList/skeletonContentList';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import OrderTabs from '@/components/ui/orderTabs/orderTabs';
import { Metadata } from 'next';
import { generateExploreMetadata } from '@/utils/metadata';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

const validTypes = ['movies', 'tv-series'] as const;

type ContentPageProps = {
  params: Promise<{ type: 'movies' | 'tv-series' }>;
  searchParams: Promise<{ [key: string]: string }>;
};

// Generate dynamic metadata for explore pages
export async function generateMetadata({
  params,
  searchParams,
}: ContentPageProps): Promise<Metadata> {
  try {
    const { type } = await params;
    const awaitedSearchParams = await searchParams;

    if (!validTypes.includes(type)) {
      return {
        title: 'Page Not Found | CineVerse',
        description: 'The requested page could not be found.',
      };
    }

    const genres = awaitedSearchParams['genres']?.split(',') || [];
    const year = awaitedSearchParams['year'] || '';
    const sortBy = awaitedSearchParams['sortBy'] || '';

    return generateExploreMetadata(type, { genres, year, sortBy });
  } catch (error) {
    return {
      title: 'Explore Content | CineVerse',
      description: 'Discover movies and TV series on CineVerse.',
    };
  }
}
export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps) {
  const { type } = await params;
  if (!validTypes.includes(type)) return notFound();

  const backendType = type === 'movies' ? 'MOVIE' : 'SERIES';

  const awaitedSearchParams = await searchParams;

  const genres = awaitedSearchParams['genres']?.split(',') || [];
  const year = awaitedSearchParams['year'] || '';
  const rate = awaitedSearchParams['rate'] || '';
  const lang = awaitedSearchParams['lang'] || '';
  const sortBy = awaitedSearchParams['sortBy'] || '';
  const order = awaitedSearchParams['order'] || 'DESC';
  const page = parseInt(awaitedSearchParams['page'] || '1', 10) - 1;

  const filtersSelected = {
    genres,
    year: year !== '' ? [year] : [],
    rate: rate !== '' ? [rate] : [],
    lang: lang !== '' ? [lang] : [],
  };

  const rawFilterOpt: FilterOpt[] = await getFilterOptions();
  const filterOpt = rawFilterOpt
    .filter(item => {
      return (
        item.title === 'Language' ||
        (backendType === 'MOVIE'
          ? item.title === 'Movie Genres'
          : item.title === 'Series Genres')
      );
    })
    .map(item => {
      if (item.key === 'genres') {
        return {
          ...item,
          title: 'Genres',
        };
      }
      return item;
    });
  const sortOpt = rawFilterOpt.filter(item => {
    return item.key === 'sortBy';
  })[0];
  // Generate structured data for explore page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Explore ${type === 'movies' ? 'Movies' : 'TV Series'} | CineVerse`,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
    }/explore/${type}`,
    description: `Browse and discover ${
      type === 'movies' ? 'movies' : 'TV series'
    } by genre, year, rating, and language on CineVerse.`,
    hasPart: genres.length
      ? genres.map(genre => ({
          '@type': 'CreativeWork',
          name: genre,
        }))
      : undefined,
    sameAs: [
      `${
        process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
      }/explore/${type}`,
    ],
  };
  const breadcrumb = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: `Explore ${type === 'movies' ? 'Movies' : 'TV Series'}`,
      item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
    },
  ];
  return (
    <>
      <Script
        id='explore page schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...structuredData,
            breadcrumb,
          }),
        }}
      />
      <section className={styles.content}>
        <div className={styles.controls}>
          <SectionHeader
            title={type == 'movies' ? 'Movies' : 'Tv Series'}
            variant={'lined'}
            filterTabs={
              <>
                <Filter
                  sections={filterOpt}
                  initialSelected={filtersSelected}
                />
                <Sort sortOptions={sortOpt} initialSortBy={sortBy} />
                <OrderTabs initialOrder={order as 'ASC' | 'DESC'} />
              </>
            }
          />
        </div>
        <Suspense
          key={JSON.stringify(awaitedSearchParams)}
          fallback={<SkeletonContentList />}
        >
          <ContentListWrapper
            filters={{ genres, year, rate, lang, sortBy, order }}
            page={page}
            type={backendType}
          />
        </Suspense>
      </section>
    </>
  );
}
