import styles from './page.module.css';
import { getAllReviewsSSR, getFilterOptions } from '@/lib/api';
import TopReviewersSidebar from '@/components/pages/reviews/topReviewersSidebar';
import ReviewsClientWrapper from '@/components/pages/reviews/reviewsClientWrapper';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import ReviewsFilters from '@/components/pages/reviews/reviewsFilters';
import SkeletonReviewsList from '@/components/shared/reviewsList/skeletonReviewsList';
import { FilterOpt } from '@/constants/types/movie';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Static metadata for reviews page
export const metadata: Metadata = {
  title: 'Movie & TV Series Reviews | Community Reviews | CineVerse',
  description:
    'Read and discover community reviews for movies and TV series. Share your thoughts, rate content, and find your next watch based on trusted user reviews on CineVerse.',
  keywords: [
    'movie reviews',
    'tv series reviews',
    'film reviews',
    'user reviews',
    'ratings',
    'community',
    'movie opinions',
    'tv show opinions',
    'cinema reviews',
    'CineVerse',
  ],
  openGraph: {
    title: 'Community Reviews | CineVerse',
    description:
      'Discover what the community is saying about movies and TV series. Read reviews, ratings, and find your next favorite content.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Reviews | CineVerse',
    description:
      'Discover what the community is saying about movies and TV series.',
  },
};

type ReviewsPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Reviews({ searchParams }: ReviewsPageProps) {
  const awaitedSearchParams = await searchParams;
  const sortBy = awaitedSearchParams['sortBy'] || 'recent';
  const page = parseInt(awaitedSearchParams['page'] || '1', 10) - 1;

  // Get token from cookies (optional - for userReaction field)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Create sort options for reviews
  const reviewSortOptions: FilterOpt = {
    title: 'Sort By',
    key: 'sortBy',
    options: [
      { label: 'Most Liked', value: 'likes' },
      { label: 'Most Recent', value: 'recent' },
    ] as any,
    multiple: false,
  };

  const { reviews, totalPages, currentPage } = await getAllReviewsSSR(
    page,
    10,
    sortBy,
    token
  );
  // Generate structured data for reviews page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Community Reviews | CineVerse',
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
    }/reviews`,
    description:
      'Read and discover community reviews for movies and TV series. Share your thoughts, rate content, and find your next watch based on trusted user reviews on CineVerse.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'CineVerse',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
    },
  };

  // Generate breadcrumb structured data for reviews page
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
        name: 'Reviews',
        item: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/reviews`,
      },
    ],
  };
  return (
    <>
      <script
        id='reviews page schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...structuredData,
            breadcrumb,
          }),
        }}
      />
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <SectionHeader
              title='Reviews'
              subtitle='Discover what others are saying about your favorite movies and TV shows'
              variant='lined'
              filterTabs={
                <ReviewsFilters
                  sortOptions={reviewSortOptions}
                  initialSortBy={sortBy}
                />
              }
            />
          </div>
          <div className={styles.reviewsList}>
            <ReviewsClientWrapper
              initialReviews={reviews || []}
              searchParams={awaitedSearchParams}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        </div>
        <TopReviewersSidebar />
      </div>
    </>
  );
}
