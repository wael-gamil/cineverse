'use client';

import styles from './profileTabs.module.css';

type TabId = 'reviews' | 'watchlist' | 'friends';

type ProfileTabsProps = {
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
};

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'reviews', label: 'Reviews' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <div className={styles.wrapper}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ''
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
