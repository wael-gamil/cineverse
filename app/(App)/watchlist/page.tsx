import { Suspense } from 'react';
import WatchlistClient from './watchlistClient'; // move existing logic here
import WatchlistSkeleton from '@/components/shared/watchlist/watchListSkeleton';

export default function WatchlistPageWrapper() {
  return (
    <Suspense fallback={<WatchlistSkeleton />}>
      <WatchlistClient />
    </Suspense>
  );
}
