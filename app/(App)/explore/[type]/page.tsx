// content/[type]/page.tsx
import ContentList from '@/components/shared/contentList/contentList';
import { getContents } from '@/lib/api';
import { notFound } from 'next/navigation';
import Filter from '@/components/ui/filter/filter';
import Sort from '@/components/ui/sort/sort';
import { getFilterOptions } from '@/lib/api';
import styles from '../page.module.css';

const validTypes = ['movies', 'tv-series'] as const;

type ContentPageProps = {
  params: Promise<{ type: 'movies' | 'tv-series' }>;
  searchParams: Promise<{ [key: string]: string }>;
};
export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps) {
  const { type } = await params;
  if (!validTypes.includes(type)) return notFound();

  // Convert to backend expected values
  const backendType = type === 'movies' ? 'MOVIE' : 'SERIES';

  const awaitedSearchParams = await searchParams;

  const genres = awaitedSearchParams['genres']?.split(',') || [];
  const year = awaitedSearchParams['year'] || '';
  const rate = awaitedSearchParams['rate'] || '';
  const lang = awaitedSearchParams['lang'] || '';
  const sortBy = awaitedSearchParams['sortBy'] || '';
  const page = parseInt(awaitedSearchParams['page'] || '1', 10) - 1;

  const filtersSelected = {
    genres,
    year: year !== '' ? [year] : [],
    rate: rate !== '' ? [rate] : [],
    lang: lang !== '' ? [lang] : [],
  };

  const filterOpt = await getFilterOptions();

  return (
    <section className={styles.content}>
      <div className={styles.controls}>
        <Filter sections={filterOpt} initialSelected={filtersSelected} />
        <Sort initialSortBy={sortBy} />
      </div>
      <ContentList
        filters={{ genres, year, rate, lang, sortBy }}
        page={page}
        fetchData={(filters, page) => getContents(backendType, filters, page)}
      />
    </section>
  );
}
