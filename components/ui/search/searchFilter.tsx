'use client';
import Button from '../button/button';
import styles from './searchFilter.module.css';
import { FilterType } from '@/constants/types/movie';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type FilterOption = {
  name: string;
  value: FilterType;
};

type Props = {
  options?: FilterOption[];
};

export default function SearchFilter({
  options = [
    { name: 'All', value: '' },
    { name: 'Movies', value: 'MOVIE' },
    { name: 'TV Shows', value: 'SERIES' },
  ],
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentType = searchParams.get('type') || '';

  const handleFilterChange = (value: FilterType) => {
    const params = new URLSearchParams(searchParams);
    if (value === '') {
      params.delete('type');
    } else {
      params.set('type', value);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.filters}>
      {options.map(({ name, value }) => (
        <Button
          key={value}
          onClick={() => handleFilterChange(value)}
          variant={currentType === value ? 'solid' : 'outline'}
          color={currentType === value ? 'primary' : 'neutral'}
        >
          {name}
        </Button>
      ))}
    </div>
  );
}
