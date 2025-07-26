'use client';

import styles from './page.module.css';
import WatchlistList from '../../../components/shared/watchlist/watchlistList';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import FilterTabs from '@/components/ui/filter/filterTabs';
import { useState } from 'react';

const WATCHLIST_STATUSES = [
  { label: 'To Watch', value: 'TO_WATCH' },
  { label: 'Watched', value: 'WATCHED' },
];

export default function WatchlistClient() {
  const [status, setStatus] = useState<'TO_WATCH' | 'WATCHED'>('TO_WATCH');

  return (
    <div className={styles.watchlistContainer}>
      <SectionHeader
        title='My Watchlist'
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
