'use client';

import { useState } from 'react';
import UserInfoPanel from './userInfoPanel';
import ProfileTabs from './profileTabs';
// import ReviewsTab from './ReviewsTab';
// import WatchlistTab from './WatchlistTab';
// import FriendsTab from './FriendsTab';
import styles from './profile.module.css';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'watchlist' | 'friends'
  >('reviews');

  return (
    <div className={styles.container}>
      <UserInfoPanel />

      <div className={styles.tabsWrapper}>
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* <div className={styles.tabContent}>
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'watchlist' && <WatchlistTab />}
        </div> */}
      </div>
    </div>
  );
}
