'use client';
import Sort from '@/components/ui/sort/sort';
import { FilterOpt } from '@/constants/types/movie';
import styles from './reviewsFilters.module.css';

type ReviewsFiltersProps = {
  sortOptions: FilterOpt;
  initialSortBy?: string;
  hideParam?: boolean;
  setCurrentSortBy?: (sort: string) => void;
};

export default function ReviewsFilters({
  sortOptions,
  initialSortBy = 'recent',
  hideParam,
  setCurrentSortBy,
}: ReviewsFiltersProps) {
  return (
    <div className={styles.filtersContainer}>
      {/* Sort Dropdown */}
      <Sort
        initialSortBy={initialSortBy}
        sortOptions={sortOptions}
        hideParam={hideParam}
        setCurrentSortBy={setCurrentSortBy}
      />
    </div>
  );
}
