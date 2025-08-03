'use client';
import ReviewsTab from '@/components/pages/profile/reviewsTab/reviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import WatchlistList from '@/components/shared/watchlist/watchlistList';

export default function TabsWrapper() {
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'to-watch' | 'watched'
  >('reviews');

  return (
    <div className={styles.tabsWrapper}>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'to-watch' && <WatchlistList status="TO_WATCH" />}
      {activeTab === 'watched' && <WatchlistList status="WATCHED" />}
    </div>
  );
}
