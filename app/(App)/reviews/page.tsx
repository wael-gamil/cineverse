import styles from './page.module.css';
import { getAllReviewsSSR, getFilterOptions } from '@/lib/api';
import TopReviewersSidebar from '@/components/pages/reviews/topReviewersSidebar';
import ReviewsClientWrapper from '@/components/pages/reviews/reviewsClientWrapper';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import ReviewsFilters from '@/components/pages/reviews/reviewsFilters';
import SkeletonReviewsList from '@/components/shared/reviewsList/skeletonReviewsList';
import { FilterOpt } from '@/constants/types/movie';
import { cookies } from 'next/headers';

type ReviewsPageProps = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default async function Reviews({ searchParams }: ReviewsPageProps) {
  const awaitedSearchParams = await searchParams;
  const sortBy = awaitedSearchParams['sortBy'] || '';
  const page = parseInt(awaitedSearchParams['page'] || '1', 10) - 1;

  // Get token from cookies (optional - for userReaction field)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Create sort options for reviews
  const reviewSortOptions: FilterOpt = {
    title: 'Sort By',
    key: 'sortBy',
    options: [{ label: 'Most Liked', value: 'likes' }] as any,
    multiple: false,
  };

  const { reviews } = await getAllReviewsSSR(page, 20, sortBy, token);

  return (
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
          />
        </div>
      </div>
      <TopReviewersSidebar />
    </div>
  );
}
