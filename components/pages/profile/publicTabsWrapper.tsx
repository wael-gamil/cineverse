'use client';
import PublicReviewsTab from '@/components/pages/profile/publicReviewsTab/publicReviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicWatchlistList from '@/components/shared/watchlist/publicWatchlistList';

type PublicTabsWrapperProps = {
  username: string;
};

export default function PublicTabsWrapper({
  username,
}: PublicTabsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'to-watch' | 'watched'
  >('reviews');

  const page = Number(searchParams.get('page') || 1) - 1;
  const handleTabChange = (newTab: 'reviews' | 'to-watch' | 'watched') => {
    // Create new URLSearchParams without the page parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');

    // Build the new URL
    const newUrl = newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams.toString()}`
      : window.location.pathname;

    // Update the URL without the page parameter
    router.replace(newUrl);

    // Set the active tab
    setActiveTab(newTab);
  };

  return (
    <div className={styles.tabsWrapper}>
      <ProfileTabs activeTab={activeTab} setActiveTab={handleTabChange} />
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
