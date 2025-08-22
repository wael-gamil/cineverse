import styles from './page.module.css';
import { getSearchResults } from '@/lib/api';
import SearchInput from '@/components/ui/search/searchInput';
import SearchResult from '@/components/ui/search/searchResult';
import ExitButton from '@/components/ui/search/exitButton';
import SearchFilter from '@/components/ui/search/searchFilter';
import SearchPageClient from '@/components/ui/search/searchPageClient';
import { FilterType } from '@/constants/types/movie';
import { Suspense } from 'react';
import SearchResultSkeleton from '@/components/ui/search/searchResultSkeleton';
import SearchResultWrapper from '@/components/ui/search/searchResultWrapper';
import { Metadata } from 'next';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

type AwaitedSearchParams = {
  q?: string;
  page?: string;
  [key: string]: string | undefined;
};

// Generate dynamic metadata for search pages
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<AwaitedSearchParams>;
}): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || '';
  const type = awaitedSearchParams.type || '';

  if (query) {
    const contentType =
      type === 'MOVIE' ? 'Movies' : type === 'SERIES' ? 'TV Series' : 'Content';
    return {
      title: `Search: "${query}" ${
        type ? `in ${contentType}` : ''
      } | CineVerse`,
      description: `Search results for "${query}" ${
        type ? `in ${contentType.toLowerCase()}` : 'in movies and TV series'
      }. Find movies, TV shows, actors, and directors on CineVerse.`,
      keywords: [
        query,
        'search',
        'movies',
        'tv series',
        'actors',
        'directors',
        'CineVerse',
        ...(type ? [type.toLowerCase()] : []),
      ],
      robots: {
        index: false, // Don't index search result pages
        follow: true,
      },
    };
  }

  return {
    title: 'Search Movies & TV Series | CineVerse',
    description:
      'Search for movies, TV series, actors, and directors. Discover new content and find detailed information, reviews, and ratings on CineVerse.',
    keywords: [
      'search',
      'movies',
      'tv series',
      'actors',
      'directors',
      'films',
      'television',
      'discover',
      'CineVerse',
    ],
  };
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<AwaitedSearchParams>;
}) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || '';
  const page = parseInt(awaitedSearchParams.page || '1', 10) - 1;
  const type = (awaitedSearchParams.type as FilterType) || '';
  // Generate structured data for search page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineVerse',
    alternateName: 'CineVerse - Movie and TV Series Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
    description:
      'Search movies, TV series, actors, and directors on CineVerse. Discover new content and find detailed information, reviews, and ratings.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'],
  };

  // Generate breadcrumb structured data for search page
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Search',
        item: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      },
    ],
  };
  return (
    <SearchPageClient>
      <Script
        id='search-results-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...structuredData,
            breadcrumb,
          }),
        }}
      />
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Search Results</h2>
          </div>
          <ExitButton />
        </div>
        <SearchInput initialQuery={query} />
        {/* <SearchFilter />  */}
      </div>
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<SearchResultSkeleton />}
      >
        <SearchResultWrapper query={query} page={page} type={type} />
      </Suspense>
    </SearchPageClient>
  );
}
