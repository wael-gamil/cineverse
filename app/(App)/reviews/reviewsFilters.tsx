'use client';

import { useState } from 'react';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import PanelWrapper from '@/components/ui/panelWrapper/panelWrapper';
import styles from './reviewsFilters.module.css';

export default function ReviewsFilters() {
  const [sortBy, setSortBy] = useState('Most Recent');
  const [filterBy, setFilterBy] = useState('');

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Most Liked', value: 'liked' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Most Controversial', value: 'controversial' },
  ];

  const filterOptions = [
    { label: 'All Reviews', value: '' },
    { label: 'Movies Only', value: 'movies' },
    { label: 'TV Series Only', value: 'series' },
    { label: '5 Star Reviews', value: '5stars' },
    { label: '4+ Star Reviews', value: '4stars' },
  ];

  return (
    <div className={styles.filtersContainer}>
      {/* Filter Dropdown */}
      <PanelWrapper
        label='Filters'
        icon={isOpen => (
          <Icon
            name={isOpen ? 'close' : 'sliders-horizontal'}
            width={16}
            strokeColor='primary'
          />
        )}
        badge={
          filterOptions.find(opt => opt.value === filterBy)?.label ||
          'All Reviews'
        }
        position='right'
        padding='lg'
        solidPanel
        relativePanel
      >
        <div className={styles.optionsPanel}>
          <h4 className={styles.panelTitle}>Filter Reviews</h4>
          <div className={styles.optionsList}>
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`${styles.optionItem} ${
                  filterBy === option.value ? styles.active : ''
                }`}
                onClick={() => setFilterBy(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </PanelWrapper>

      {/* Sort Dropdown */}
      <PanelWrapper
        label='Sort by'
        icon={isOpen => (
          <Icon
            name={isOpen ? 'close' : 'sliders-horizontal'}
            width={16}
            strokeColor='primary'
          />
        )}
        badge={sortBy}
        position='right'
        padding='lg'
        solidPanel
        relativePanel
      >
        <div className={styles.optionsPanel}>
          <h4 className={styles.panelTitle}>Sort By</h4>
          <div className={styles.optionsList}>
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`${styles.optionItem} ${
                  sortBy === option.label ? styles.active : ''
                }`}
                onClick={() => setSortBy(option.label)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </PanelWrapper>
    </div>
  );
}
