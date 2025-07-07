'use client';
import styles from './sort.module.css';
import Button from '../button/button';
import { Icon } from '../icon/icon';
import PanelWrapper from '../panelWrapper/panelWrapper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FilterOpt } from '@/constants/types/movie';

type SortProps = {
  initialSortBy: string;
  sortOptions: FilterOpt;
};
export default function Sort({ initialSortBy, sortOptions }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(initialSortBy || '');

  const [closePanel, setClosePanel] = useState<() => void>(() => () => {});

  useEffect(() => {
    setSortBy(initialSortBy || '');
  }, [initialSortBy]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortBy) params.set('sortBy', sortBy);
    else params.delete('sortBy');

    router.push(`?${params.toString()}`, { scroll: false });
    setTimeout(() => closePanel(), 200);
  }, [sortBy]);

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
      badge={sortOptions.options.find(opt => opt.value === sortBy)?.label}
      position='right'
      padding='lg'
      solidPanel
      setClose={setClosePanel}
      relativePanel
    >
      <div className={styles.options}>
        {sortOptions.options.map(option => (
          <Button
            key={option.value}
            type='button'
            align='left'
            width='100%'
            variant={sortBy === option.value ? 'solid' : 'ghost'}
            color={sortBy === option.value ? 'primary' : 'neutral'}
            onClick={() =>
              option.value === sortBy ? setSortBy('') : setSortBy(option.value)
            }
          >
            {option.label}
          </Button>
        ))}
      </div>
    </PanelWrapper>
  );
}
