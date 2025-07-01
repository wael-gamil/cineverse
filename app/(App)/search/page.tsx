import styles from './page.module.css';
import { getSearchResults } from '@/lib/api';
import SearchInput from '@/components/ui/search/searchInput';
import SearchResult from '@/components/ui/search/searchResult';
import ExitButton from '@/components/ui/search/exitButton';
import SearchFilter from '@/components/ui/search/searchFilter';
import { FilterType } from '@/constants/types/movie';

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

  const { contents, totalPages, currentPage } = await getSearchResults(
    query,
    type,
    page
  );

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

      <SearchResult
        contents={contents}
        query={query}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
