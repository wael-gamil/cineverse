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
  initialOrder: string;
  sortOptions: FilterOpt;
  orderOptions: FilterOpt;
};
export default function Sort({
  initialSortBy,
  initialOrder,
  sortOptions,
  orderOptions,
}: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(initialSortBy || '');
  const [order, setOrder] = useState(initialOrder || '');

  const [closePanel, setClosePanel] = useState<() => void>(() => () => {});

  useEffect(() => {
    setSortBy(initialSortBy || '');
  }, [initialSortBy]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortBy) params.set('sortBy', sortBy);
    else params.delete('sortBy');

    if (order) params.set('order', order);
    else params.delete('order');

    router.push(`?${params.toString()}`, { scroll: false });
    setTimeout(() => closePanel(), 200);
  }, [sortBy, order]);

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
      setClose={setClosePanel}
    >
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Field</h3>
          <div className={styles.options}>
            {sortOptions.options.map(option => (
              <Button
                key={option.value}
                type='button'
                variant={sortBy === option.value ? 'solid' : 'ghost'}
                color={sortBy === option.value ? 'primary' : 'neutral'}
                onClick={() =>
                  option.value === sortBy
                    ? setSortBy('')
                    : setSortBy(option.value)
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order</h3>
          <div className={styles.options}>
            {orderOptions.options.map(option => (
              <Button
                key={option.value}
                type='button'
                variant={order === option.value ? 'solid' : 'ghost'}
                color={order === option.value ? 'primary' : 'neutral'}
                onClick={() =>
                  option.value === order ? setOrder('') : setOrder(option.value)
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
}
