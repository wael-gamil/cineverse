import styles from './page.module.css';
import MoviesList from './movieList';
import Filter from '@/app/components/ui/filter/filter';
import { getFilterOptions } from '@/app/lib/api';
import { FilterOpt } from '@/app/constants/types/movie';
import { Icon } from '@/app/components/ui/icon/icon';
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
  //construct filters
  const filtersSelected = {
    genres: genres,
    year: year !== '' ? [year] : [],
    rate: rate !== '' ? [rate] : [],
    lang: lang !== '' ? [lang] : [],
  };

  const filterOpt: FilterOpt[] = await getFilterOptions();
  return (
    <main className={styles.container}>
      <header className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Icon and Badge */}
          <div className={styles.iconWrapper}>
            <div className={styles.iconBackground}></div>
            <div className={styles.iconForeground}>
              <Icon name='film' className={styles.filmIcon} />
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.heroTitle}>
            <span className={styles.titleCine}>Cine</span>
            <span className={styles.titleVerse}>Verse</span>
          </h1>

          {/* Subtitle */}
          <div className={styles.heroSubtitleWrapper}>
            <div className={styles.subtitleLine}></div>
            <p className={styles.heroSubtitle}>Discover Movies & Series</p>
            <div className={styles.subtitleLine}></div>
          </div>

          {/* Description */}
          <p className={styles.heroDescription}>
            Explore a growing universe of cinema, from trending hits to timeless
            classics. Immerse yourself in stories that captivate, inspire, and
            entertain.
          </p>

          {/* Stats */}
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statDot}></span>
              <span>10,000+ Titles</span>
            </div>
            <div className={styles.statItem}>
              <Icon name='sparkles' className={styles.statIconYellow} />
              <span>Premium Quality</span>
            </div>
            <div className={styles.statItem}>
              <Icon name='trending-up' className={styles.statIconGreen} />
              <span>Updated Daily</span>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.heroDividerWrapper}>
            <div className={styles.heroDivider}></div>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.controls}>
          <Filter sections={filterOpt} initialSelected={filtersSelected} />
          <div className={styles.sort}>Sort</div>
        </div>
        <MoviesList
          filters={{
            genres,
            year,
            rate,
            lang,
          }}
        />
        <span>Pagination</span>
      </section>
    </main>
  );
}
