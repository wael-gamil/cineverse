'use client';
import styles from './searchResult.module.css';
import { FilterType, Movie } from '@/app/constants/types/movie';
import ContentCard from '../../cards/contentCard';
import Button from '../button/button';
import Pagination from '../pagination/pagination';
import { Icon } from '../icon/icon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  movieRes: Movie[];
  query: string;
  currentPage: number;
  totalPages: number;
};
export default function SearchResult({
  movieRes,
  query,
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const filterOptions: { name: string; value: FilterType }[] = [
    { name: 'All', value: '' },
    { name: 'Movies', value: 'MOVIE' },
    { name: 'TV Shows', value: 'SERIES' },
  ];
  const [activeFilter, setActiveFilter] = useState<FilterType>('');

  const filtered = movieRes.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === '' || item.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className={styles.results}>
      <div className={styles.filters}>
        {filterOptions.map(({ name, value }) => (
          <Button
            key={value}
            onClick={() => setActiveFilter(value)}
            variant={activeFilter === value ? 'solid' : 'outline'}
            color={activeFilter === value ? 'primary' : 'neutral'}
          >
            {name}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircle}>
              <Icon
                name='search'
                strokeColor='primary'
                width={40}
                height={40}
              />
            </div>
            <div className={styles.questionBadge}>
              <span>?</span>
            </div>
          </div>
          <h3 className={styles.title}>No results found</h3>
          <p className={styles.subtitle}>
            We couldn't find any movies or TV shows matching "{query}". Try
            searching with different keywords or check your spelling.
          </p>
          <div className={styles.actions}>
            <Button onClick={() => router.push(`/search`)}>Clear Search</Button>
            <Button onClick={() => setActiveFilter('')} color='neutral'>
              Browse All
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => (
            <ContentCard key={item.id} movie={item} />
          ))}
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
