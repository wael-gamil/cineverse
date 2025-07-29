'use client';
import ReviewsTab from '@/components/pages/profile/reviewsTab/reviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import WatchListTab from '@/components/pages/profile/watchlistTab/watchListTab';
export default function TabsWrapper() {
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'watchlist' | 'friends'
  >('reviews');
  return (
    <div className={styles.tabsWrapper}>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'reviews' && <ReviewsTab />}
      {activeTab === 'watchlist' && <WatchListTab />}
    </div>
  );
}
