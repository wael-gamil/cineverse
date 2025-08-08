'use client';

import styles from './profileTabs.module.css';

type TabId = 'reviews' | 'to-watch' | 'watched';

type ProfileTabsProps = {
  activeTab: TabId;
  // Updated to accept a custom function instead of React state setter
  setActiveTab: (tab: TabId) => void;
};

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'reviews', label: 'Reviews' },
    { id: 'to-watch', label: 'To Watch' },
    { id: 'watched', label: 'Watched' },
  ];

  return (
    <div
      className={styles.wrapper}
      role='tablist'
      aria-label='Profile sections'
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ''
          }`}
          onClick={() => setActiveTab(tab.id)}
          role='tab'
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          type='button'
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
