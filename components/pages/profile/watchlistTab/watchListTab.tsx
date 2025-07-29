'use client';

import { useState } from 'react';
import styles from './watchListTab.module.css';
import FilterTabs from '@/components/ui/filter/filterTabs';
import WatchlistList from '@/components/shared/watchlist/watchlistList';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
const WATCHLIST_STATUSES = [
  { label: 'To Watch', value: 'TO_WATCH' },
  { label: 'Watched', value: 'WATCHED' },
];

export default function WatchListTab() {
  const [status, setStatus] = useState<'TO_WATCH' | 'WATCHED'>('TO_WATCH');

  return (
    <div className={styles.tabContainer}>
      <SectionHeader
        title='My Watchlist'
        variant='ghost'
        filterTabs={
          <FilterTabs
            options={WATCHLIST_STATUSES}
            active={status}
            onChange={val => setStatus(val as 'TO_WATCH' | 'WATCHED')}
          />
        }
      />
      <WatchlistList status={status} />
    </div>
  );
}
