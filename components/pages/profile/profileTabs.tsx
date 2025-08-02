'use client';

import styles from './profileTabs.module.css';

type TabId = 'reviews' | 'to-watch' | 'watched';

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
    { id: 'to-watch', label: 'To Watch' },
    { id: 'watched', label: 'Watched' },
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
