'use client';
import ReviewsTab from '@/components/pages/profile/reviewsTab/reviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WatchlistList from '@/components/shared/watchlist/watchlistList';

export default function TabsWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'to-watch' | 'watched'
  >('reviews');

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
      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'to-watch' && <WatchlistList status="TO_WATCH" />}
      {activeTab === 'watched' && <WatchlistList status="WATCHED" />}
    </div>
  );
}