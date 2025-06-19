import styles from './contentOverview.module.css';

import { NormalizedContent } from '@/app/constants/types/movie';
import { Icon } from '../../ui/icon/icon';

type ContentOverviewProps = {
  content: NormalizedContent;
  totalReviews?: number;
  watchlistCount?: number;
  genres?: string[];
};

export default function ContentOverview({
  content,
  totalReviews,
  watchlistCount,
  genres,
}: ContentOverviewProps) {
  const runtime =
    content.runtime && !isNaN(Number(content.runtime))
      ? (() => {
          const totalMinutes = Number(content.runtime);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return hours > 0
            ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
            : `${minutes}m`;
        })()
      : content.runtime;
  const genreList = content.genres || genres;
  return (
    <section className={styles.overview}>
      {/* LEFT SECTION */}
      <div className={styles.outer}>
        <h2 className={styles.heading}>
          {/* {content.type === 'movie' ? 'Movie Overview' : content.type === 'serie' 'Series Overview'} */}
          {content.type.charAt(0).toUpperCase() + content.type.slice(1)}{' '}
          Overview
        </h2>
        <div className={styles.container}>
          <p className={styles.description}>{content.description}</p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='tv' strokeColor='white' width={16} height={16} />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Type</span>
                <span className={styles.value}>{content.type}</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon
                  name='calendar'
                  strokeColor='white'
                  width={16}
                  height={16}
                />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Release Date</span>
                <span className={styles.value}>{content.releaseDate}</span>
              </div>
            </div>

            {content.runtime && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='clock'
                    strokeColor='white'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Runtime</span>
                  <span className={styles.value}>{runtime}</span>
                </div>
              </div>
            )}

            {content.language && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='languages'
                    strokeColor='white'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Language</span>
                  <span className={styles.value}>{content.language}</span>
                </div>
              </div>
            )}

            {content.productionCountry && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='globe'
                    strokeColor='white'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Country</span>
                  <span className={styles.value}>
                    {content.productionCountry}
                  </span>
                </div>
              </div>
            )}
            {content.numberOfSeasons && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='tv-alt'
                    strokeColor='white'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Seasons</span>
                  <span className={styles.value}>
                    {content.numberOfSeasons}
                  </span>
                </div>
              </div>
            )}
            {content.numberOfEpisodes && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='film'
                    strokeColor='white'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Episodes</span>
                  <span className={styles.value}>
                    {content.numberOfEpisodes}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.outer}>
        <h2 className={styles.heading}>
          {/* {content.type === 'movie' ? 'Movie Overview' : content.type === 'serie' 'Series Overview'} */}
          {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Stats
        </h2>
        <div className={styles.container}>
          <div className={styles.ratingBlock}>
            <div className={styles.ratingWrapper}>
              <Icon name='star' strokeColor='secondary' />
              <span className={styles.imdbScore}>
                {content.imdbRate ? content.imdbRate.toFixed(1) : 'N/A'}
              </span>
            </div>
            <span className={styles.label}>IMDb Rating</span>
          </div>

          <div className={styles.divider} />
          {typeof totalReviews === 'number' && totalReviews > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='user' strokeColor='white' width={16} height={16} />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Total Reviews</span>
                <span className={styles.value}>
                  {totalReviews.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {typeof watchlistCount === 'number' && watchlistCount > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon
                  name='bookmark'
                  strokeColor='white'
                  width={16}
                  height={16}
                />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Watchlist Count</span>
                <span className={styles.value}>
                  {watchlistCount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {genreList && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='badge' strokeColor='white' width={16} height={16} />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Genres</span>
                <span className={styles.value}>{genreList.join(', ')}</span>
              </div>
            </div>
          )}

          {typeof content.platformRate === 'number' &&
            content.platformRate > 0 && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name='star'
                    strokeColor='secondary'
                    width={16}
                    height={16}
                  />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Cineverse Score</span>
                  <span className={styles.value}>
                    {content.platformRate * 10}%
                  </span>
                </div>
              </div>
            )}
          {content.status && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon
                  name='status'
                  strokeColor='white'
                  width={16}
                  height={16}
                />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Status</span>
                <span className={styles.value}>{content.status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
