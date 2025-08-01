'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUserWatchlistSSR } from '@/lib/api';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import styles from './page.module.css';
import SectionHeader from '@/components/shared/contentSliderSection/sectionHeader';
import FilterTabs from '@/components/ui/filter/filterTabs';
import WatchlistServerList from './watchlistServerList';

const WATCHLIST_STATUSES = [
  { label: 'To Watch', value: 'TO_WATCH' },
  { label: 'Watched', value: 'WATCHED' },
];

import { WatchlistItem } from '@/constants/types/movie';

type WatchlistServerPageProps = {
  initialStatus: 'TO_WATCH' | 'WATCHED';
  initialPage: number;
  initialData:
    | {
        items: WatchlistItem[];
        totalPages: number;
        totalElements: number;
        currentPage: number;
      }
    | undefined;
};

export default function WatchlistServerPage({
  initialStatus,
  initialPage,
  initialData,
}: WatchlistServerPageProps) {
  const [status, setStatus] = useState<'TO_WATCH' | 'WATCHED'>(initialStatus);
  const router = useRouter();

  const handleStatusChange = (newStatus: 'TO_WATCH' | 'WATCHED') => {
    setStatus(newStatus);
    // Update URL to reflect the status change
    const params = new URLSearchParams();
    params.set('status', newStatus);
    router.push(`/watchlist?${params.toString()}`);
  };
  return (
    <section className={styles.content}>
      <div className={styles.controls}>
        <SectionHeader
          title='My Watchlist'
          variant='lined'
          filterTabs={
            <FilterTabs
              options={WATCHLIST_STATUSES}
              active={status}
              onChange={val =>
                handleStatusChange(val as 'TO_WATCH' | 'WATCHED')
              }
            />
          }
        />
      </div>
      <WatchlistServerList status={status} initialData={initialData} />
    </section>
  );
}
