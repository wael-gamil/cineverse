import styles from './page.module.css';
import { getSearchResults } from '@/app/lib/api';
import SearchInput from '@/app/components/ui/search/searchInput';
import SearchResult from '@/app/components/ui/search/searchResult';
import ExitButton from '@/app/components/ui/search/exitButton';

type SearchProps = {
  q?: string;
  page?: string;
};
export default async function Search({
  searchParams,
}: {
  searchParams: SearchProps;
}) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || '';
  const page = parseInt(awaitedSearchParams.page || '1', 10);

  const { content, totalPages, currentPage } = await getSearchResults(
    query,
    page
  );

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Search Results</h2>
            <p className={styles.subtitle}>
              {query ? `Searching for "${query}"` : 'Start typing to search...'}
            </p>
          </div>
          <ExitButton />
        </div>
        <div className={styles.inputWrapper}>
          <SearchInput initialQuery={query} />
        </div>
      </div>

      <SearchResult
        movieRes={content}
        query={query}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
