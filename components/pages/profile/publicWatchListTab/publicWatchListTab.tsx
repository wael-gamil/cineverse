'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicWatchlistList from '@/components/shared/watchlist/publicWatchlistList';
import FilterTabs from '@/components/ui/filter/filterTabs';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import styles from '../watchlistTab/watchListTab.module.css';

interface PublicWatchListTabProps {
  username: string;
}

const WATCHLIST_STATUSES = [
  { label: 'To Watch', value: 'TO_WATCH' },
  { label: 'Watched', value: 'WATCHED' },
];

export default function PublicWatchListTab({
  username,
}: PublicWatchListTabProps) {
  const [status, setStatus] = useState<'TO_WATCH' | 'WATCHED'>('TO_WATCH');
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1; // Convert to 0-based

  return (
    <div className={styles.tabContainer}>
      <SectionHeader
        title={`${username}'s Watchlist`}
        variant='ghost'
        filterTabs={
          <FilterTabs
            options={WATCHLIST_STATUSES}
            active={status}
            onChange={val => setStatus(val as 'TO_WATCH' | 'WATCHED')}
          />
        }
      />
      <PublicWatchlistList username={username} status={status} page={page} />
    </div>
  );
}
