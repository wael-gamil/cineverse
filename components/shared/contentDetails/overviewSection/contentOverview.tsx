'use client';
import styles from './contentOverview.module.css';
import { NormalizedContent } from '@/constants/types/movie';
import { Icon } from '../../../ui/icon/icon';
import Image from 'next/image';
import Badge from '../../../ui/badge/badge';
import { useFilterOptionsQuery } from '@/hooks/useFilterOptionsQuery';
import { useProvidersQuery } from '@/hooks/useProvidersQuery';
import { useStatsQuery } from '@/hooks/useStatsQuery';
import { useEffect, useRef, useState } from 'react';

type ContentOverviewProps = {
  content: NormalizedContent;
  genres?: string[];
};

export default function ContentOverview({
  content,
  genres,
}: ContentOverviewProps) {
  const { data } = useStatsQuery(content.id);
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

  const { data: filterOptions } = useFilterOptionsQuery();
  const languageData = filterOptions?.find(item => item.key === 'lang');
  const fullLangLabel = languageData?.options?.find(
    opt => opt.value === content.language
  )?.label;
  const { data: providers } =
    content.type === 'movie' || content.type === 'series'
      ? useProvidersQuery(content.id)
      : { data: undefined };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [content.description]);

  return (
    <section className={styles.overview}>
      <h2 className={styles.heading}>
        {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Overview
      </h2>

      <div className={styles.container}>
        {/* DESCRIPTION PANEL WITH FLOATING STATS */}
        {content.description && (
          <div className={styles.descriptionWrapper}>
            {/* Floating Stats Badges */}
            {((typeof data?.totalReviews === 'number' &&
              data?.totalReviews > 0) ||
              (typeof data?.watchlistCount === 'number' &&
                data?.watchlistCount > 0) ||
              (typeof data?.platformRate === 'number' &&
                data?.platformRate > 0)) && (
              <div className={styles.floatingStats}>
                {typeof data?.platformRate === 'number' &&
                  data?.platformRate > 0 && (
                    <Badge
                      className={styles.floatingBadge}
                      iconName='starFilled'
                      iconColor='white'
                      text='Rating'
                      number={Math.round((data?.platformRate ?? 0) * 10)}
                      backgroundColor='bg-primary'
                      numberColor='color-white'
                      size='size-sm'
                    />
                  )}
                {typeof data?.totalReviews === 'number' &&
                  data?.totalReviews > 0 && (
                    <Badge
                      className={styles.floatingBadge}
                      iconName='message-square'
                      iconColor='white'
                      text='Reviews'
                      number={data?.totalReviews}
                      backgroundColor='bg-primary'
                      numberColor='color-white'
                      size='size-sm'
                    />
                  )}
                {typeof data?.watchlistCount === 'number' &&
                  data?.watchlistCount > 0 && (
                    <Badge
                      className={styles.floatingBadge}
                      iconName='bookmark'
                      iconColor='white'
                      text='Watchlist'
                      number={data?.watchlistCount}
                      backgroundColor='bg-primary'
                      numberColor='color-white'
                      size='size-sm'
                    />
                  )}
              </div>
            )}

            <div className={styles.descriptionSection}>
              <h3 className={styles.descriptionHeading}>Description</h3>
              <p
                ref={descriptionRef}
                className={`${styles.descriptionText} ${
                  showFullDescription ? styles.expanded : ''
                }`}
              >
                {content.description}
              </p>
              {isOverflowing && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() => setShowFullDescription(prev => !prev)}
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* CLUSTERED INFO GRID */}
        <div className={styles.clusteredGrid}>
          {/* Basic Info Cluster */}
          <div className={styles.infoCluster}>
            <h3 className={styles.clusterTitle}>Basic Info</h3>
            <div className={styles.clusterItems}>
              <div className={styles.clusterItem}>
                <div className={styles.clusterIcon}>
                  <Icon name='tv' strokeColor='white' />
                </div>
                <div className={styles.clusterContent}>
                  <span className={styles.clusterLabel}>Type</span>
                  <span className={styles.clusterValue}>
                    {content.type.charAt(0).toUpperCase() +
                      content.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className={styles.clusterItem}>
                <div className={styles.clusterIcon}>
                  <Icon name='calendar' strokeColor='white' />
                </div>
                <div className={styles.clusterContent}>
                  <span className={styles.clusterLabel}>Release Date</span>
                  <span className={styles.clusterValue}>
                    {content.releaseDate}
                  </span>
                </div>
              </div>

              {typeof content.runtime === 'number' && content.runtime > 0 && (
                <div className={styles.clusterItem}>
                  <div className={styles.clusterIcon}>
                    <Icon name='clock' strokeColor='white' />
                  </div>
                  <div className={styles.clusterContent}>
                    <span className={styles.clusterLabel}>Runtime</span>
                    <span className={styles.clusterValue}>{runtime}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Regional Info Cluster */}
          {(content.language ||
            content.productionCountry ||
            content.status) && (
            <div className={styles.infoCluster}>
              <h3 className={styles.clusterTitle}>Regional Info</h3>
              <div className={styles.clusterItems}>
                {content.language && (
                  <div className={styles.clusterItem}>
                    <div className={styles.clusterIcon}>
                      <Icon name='languages' strokeColor='white' />
                    </div>
                    <div className={styles.clusterContent}>
                      <span className={styles.clusterLabel}>Language</span>
                      <span className={styles.clusterValue}>
                        {fullLangLabel ? fullLangLabel : content.language}
                      </span>
                    </div>
                  </div>
                )}

                {content.productionCountry && (
                  <div className={styles.clusterItem}>
                    <div className={styles.clusterIcon}>
                      <Icon name='globe' strokeColor='white' />
                    </div>
                    <div className={styles.clusterContent}>
                      <span className={styles.clusterLabel}>Country</span>
                      <span className={styles.clusterValue}>
                        {content.productionCountry}
                      </span>
                    </div>
                  </div>
                )}

                {content.status && (
                  <div className={styles.clusterItem}>
                    <div className={styles.clusterIcon}>
                      <Icon name='status' strokeColor='white' />
                    </div>
                    <div className={styles.clusterContent}>
                      <span className={styles.clusterLabel}>Status</span>
                      <span className={styles.clusterValue}>
                        {content.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Series Info Cluster */}
          {(content.numberOfSeasons || content.numberOfEpisodes) && (
            <div className={`${styles.infoCluster}`}>
              <h3 className={styles.clusterTitle}>Series Info</h3>
              <div className={styles.clusterItems}>
                {content.numberOfSeasons && (
                  <div className={styles.clusterItem}>
                    <div className={styles.clusterIcon}>
                      <Icon name='tv-alt' strokeColor='white' />
                    </div>
                    <div className={styles.clusterContent}>
                      <span className={styles.clusterLabel}>Seasons</span>
                      <span className={styles.clusterValue}>
                        {content.numberOfSeasons}
                      </span>
                    </div>
                  </div>
                )}

                {content.numberOfEpisodes && (
                  <div className={styles.clusterItem}>
                    <div className={styles.clusterIcon}>
                      <Icon name='film' strokeColor='white' />
                    </div>
                    <div className={styles.clusterContent}>
                      <span className={styles.clusterLabel}>Episodes</span>
                      <span className={styles.clusterValue}>
                        {content.numberOfEpisodes}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* COMBINED CONTENT SECTION */}
        {((genreList && genreList.length > 0) ||
          (providers && providers.length > 0)) && (
          <div className={styles.combinedContent}>
            {genreList && genreList.length > 0 && (
              <div className={styles.contentSection}>
                <h3 className={styles.sectionTitle}>Genres</h3>
                <div className={styles.genresFlow}>
                  {genreList.map((genre, index) => (
                    <span key={index} className={styles.genreTag}>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {providers && providers.length > 0 && (
              <div className={styles.contentSection}>
                <h3 className={styles.sectionTitle}>Available On</h3>
                <div className={styles.providersFlow}>
                  {providers.map((provider, index) => (
                    <div key={index} className={styles.providerCard}>
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        fill
                        sizes='60px'
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
