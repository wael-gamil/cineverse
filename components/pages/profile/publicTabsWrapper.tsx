'use client';
import PublicReviewsTab from '@/components/pages/profile/publicReviewsTab/publicReviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicWatchlistList from '@/components/shared/watchlist/publicWatchlistList';

type PublicTabsWrapperProps = {
  username: string;
};

export default function PublicTabsWrapper({
  username,
}: PublicTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'to-watch' | 'watched'
  >('reviews');

  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1;

  return (
    <div className={styles.tabsWrapper}>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'reviews' && <PublicReviewsTab username={username} />}
      {activeTab === 'to-watch' && (
        <PublicWatchlistList
          username={username}
          status='TO_WATCH'
          page={page}
        />
      )}
      {activeTab === 'watched' && (
        <PublicWatchlistList username={username} status='WATCHED' page={page} />
      )}
    </div>
  );
}
