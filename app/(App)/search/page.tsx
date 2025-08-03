import styles from './page.module.css';
import { getSearchResults } from '@/lib/api';
import SearchInput from '@/components/ui/search/searchInput';
import SearchResult from '@/components/ui/search/searchResult';
import ExitButton from '@/components/ui/search/exitButton';
import SearchFilter from '@/components/ui/search/searchFilter';
import { FilterType } from '@/constants/types/movie';
import { Suspense } from 'react';
import SearchResultSkeleton from '@/components/ui/search/searchResultSkeleton';
import SearchResultWrapper from '@/components/ui/search/searchResultWrapper';

export const dynamic = 'force-dynamic';

type AwaitedSearchParams = {
  q?: string;
  page?: string;
  [key: string]: string | undefined;
};

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<AwaitedSearchParams>;
}) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || '';
  const page = parseInt(awaitedSearchParams.page || '1', 10) - 1;
  const type = (awaitedSearchParams.type as FilterType) || '';

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Search Results</h2>
          </div>
          <ExitButton />
        </div>
        <SearchInput initialQuery={query} />
        <SearchFilter />
      </div>
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<SearchResultSkeleton />}
      >
        <SearchResultWrapper query={query} page={page} type={type} />
      </Suspense>
    </div>
  );
}
