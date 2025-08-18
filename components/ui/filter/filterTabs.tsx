'use client';

import Button from '../button/button';
import styles from './filterTabs.module.css';

type FilterTabsProps<T extends string> = {
  options: { label: string; value: T; title?: string }[];
  active?: T;
  onChange?: (value: T) => void;
  showAll?: boolean;
  allLabel?: string;
};

export default function FilterTabs<T extends string>({
  options,
  active,
  onChange,
  showAll = false,
  allLabel = 'All',
}: FilterTabsProps<T>) {
  const fullOptions = showAll
    ? [{ label: allLabel, value: 'ALL' as T }, ...options]
    : options;
  return (
    <div className={styles.filterTabs}>
      {fullOptions.map(option => (
        <Button
          key={option.value}
          onClick={() => {
            if (onChange && option.value !== active) {
              onChange(option.value);
            }
          }}
          padding='sm'
          variant={active === option.value ? 'solid' : 'ghost'}
          color={active === option.value ? 'primary' : 'neutral'}
          title={option.title}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
