import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getUserWatchlistSSR } from '@/lib/api';
import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import WatchlistServerPage from './watchlistServerPage';
import WatchlistSkeleton from '@/components/shared/watchlist/watchListSkeleton';
import { WatchlistItem } from '@/constants/types/movie';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Static metadata for watchlist page
export const metadata: Metadata = {
  title: 'My Watchlist | Track Movies & TV Series | CineVerse',
  description:
    'Manage your personal watchlist. Keep track of movies and TV series you want to watch or have already watched. Never forget your next great watch on CineVerse.',
  keywords: [
    'watchlist',
    'personal list',
    'track movies',
    'track tv series',
    'want to watch',
    'watched list',
    'movie tracker',
    'tv show tracker',
    'CineVerse',
  ],
  robots: {
    index: false, // Personal content - don't index
    follow: true,
  },
  openGraph: {
    title: 'My Watchlist | CineVerse',
    description:
      'Manage your personal watchlist and track your favorite movies and TV series.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Watchlist | CineVerse',
    description:
      'Manage your personal watchlist and track your favorite content.',
  },
};

type SearchParams = {
  status?: 'TO_WATCH' | 'WATCHED';
  page?: string;
};

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <NotFoundClient type='user' />;
  }

  const awaitedSearchParams = await searchParams;
  const status =
    (awaitedSearchParams.status as 'TO_WATCH' | 'WATCHED') || 'TO_WATCH';
  const page = parseInt(awaitedSearchParams.page || '1', 10) - 1;

  // Prefetch watchlist data
  await queryClient.prefetchQuery({
    queryKey: ['user-watchlist-ssr', status, page],
    queryFn: () => getUserWatchlistSSR(token, status, page, 24),
  });
  const dehydratedState = dehydrate(queryClient);
  // Get the prefetched data
  const watchlistData:
    | {
        items: WatchlistItem[];
        totalPages: number;
        totalElements: number;
        currentPage: number;
      }
    | undefined = queryClient.getQueryData([
    'user-watchlist-ssr',
    status,
    page,
  ]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<WatchlistSkeleton />}
      >
        <WatchlistServerPage
          initialStatus={status}
          initialPage={page}
          initialData={watchlistData}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
