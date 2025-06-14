import styles from './page.module.css';
import MoviesList from './movieList';
import Filter from '@/app/components/ui/filter/filter';
import Sort from '@/app/components/ui/sort/sort';
import { getFilterOptions } from '@/app/lib/api';
import { FilterOpt } from '@/app/constants/types/movie';

export default async function Movies({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Await the searchParams to ensure they are resolved before using them
  const awaitedSearchParams = await searchParams;
  const genres = awaitedSearchParams['genres']?.split(',') || [];
  const year = awaitedSearchParams['year'] || '';
  const rate = awaitedSearchParams['rate'] || '';
  const lang = awaitedSearchParams['lang'] || '';
  const sortBy = awaitedSearchParams['sortBy'] || '';
  const page = parseInt(awaitedSearchParams['page'] || '0', 10);

  //construct filters
  const filtersSelected = {
    genres: genres,
    year: year !== '' ? [year] : [],
    rate: rate !== '' ? [rate] : [],
    lang: lang !== '' ? [lang] : [],
  };

  const filterOpt: FilterOpt[] = await getFilterOptions();

  return (
    <section className={styles.content}>
      <div className={styles.controls}>
        <Filter sections={filterOpt} initialSelected={filtersSelected} />
        <Sort initialSortBy={sortBy} />
      </div>

      <MoviesList
        filters={{
          genres,
          year,
          rate,
          lang,
          sortBy,
        }}
        page={page}
      />
    </section>
  );
}
