'use client';
import PublicReviewsTab from '@/components/pages/profile/publicReviewsTab/publicReviewsTab';
import ProfileTabs from './profileTabs';
import styles from '../../../app/(App)/profile/profile.module.css';
import { useState } from 'react';
import PublicWatchListTab from '@/components/pages/profile/publicWatchListTab/publicWatchListTab';

type PublicTabsWrapperProps = {
  username: string;
};

export default function PublicTabsWrapper({
  username,
}: PublicTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'watchlist' | 'friends'
  >('reviews');

  return (
    <div className={styles.tabsWrapper}>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'reviews' && <PublicReviewsTab username={username} />}
      {activeTab === 'watchlist' && <PublicWatchListTab username={username} />}
    </div>
  );
}
