'use client';
import styles from './sort.module.css';
import Button from '../button/button';
import { Icon } from '../icon/icon';
import PanelWrapper from '../panelWrapper/panelWrapper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type SortProps = {
  initialSortBy: string;
};
export default function Sort({ initialSortBy }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(initialSortBy || '');

  useEffect(() => {
    setSortBy(initialSortBy || '');
  }, [initialSortBy]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Update sortBy in URL
    if (sortBy) {
      params.set('sortBy', sortBy);
    } else {
      params.delete('sortBy');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [sortBy, router, searchParams]);

  // Sort options
  const sortOptions = [
    { label: 'Most Recent', value: 'mostRecent' },
    { label: 'Top Rated', value: 'topRated' },
  ];
  return (
    <PanelWrapper
      label='Sort by'
      icon={isOpen => (
        <Icon
          name={isOpen ? 'close' : 'sliders-horizontal'}
          width={16}
          strokeColor='primary'
        />
      )}
      badge={sortOptions.find(o => o.value === sortBy)?.label}
      position='right'
      solidPanel
      padding='sm'
    >
      <div className={styles.options}>
        {sortOptions.map(option => (
          <Button
            key={option.value}
            type='button'
            variant={sortBy === option.value ? 'solid' : 'ghost'}
            color={sortBy === option.value ? 'primary' : 'neutral'}
            onClick={() => setSortBy(option.value)}
            width='100%'
            align='left'
          >
            {option.label}
          </Button>
        ))}
      </div>
    </PanelWrapper>
  );
}
