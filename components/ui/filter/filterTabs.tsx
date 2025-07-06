'use client';

import Button from '../button/button';
import styles from './filterTabs.module.css';

type FilterOption = 'ALL' | 'MOVIE' | 'SERIES';

type FilterTabsProps = {
  active?: FilterOption;
  onChange?: (value: FilterOption) => void;
  showAll?: boolean;
};

export default function FilterTabs({
  active = 'MOVIE',
  onChange,
  showAll = true,
}: FilterTabsProps) {
  const options: { label: string; value: FilterOption }[] = [
    ...(showAll ? [{ label: 'All', value: 'ALL' as FilterOption }] : []),
    { label: 'Movies', value: 'MOVIE' },
    { label: 'Series', value: 'SERIES' },
  ];

  return (
    <div className={styles.filterTabs}>
      {options.map(option => (
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
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
