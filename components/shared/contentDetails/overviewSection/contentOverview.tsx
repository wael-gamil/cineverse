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
      {/* LEFT SECTION */}
      <h2 className={styles.heading}>
        {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Overview
      </h2>
      <div className={styles.container}>
        {content.description && (
          <div className={styles.descriptionWrapper}>
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionHeading}>Description</h2>
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
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Icon name='tv' strokeColor='white' />
            </div>
            <div className={styles.titleBlock}>
              <span className={styles.label}>Type</span>
              <span className={styles.value}>
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Icon name='calendar' strokeColor='white' />
            </div>
            <div className={styles.titleBlock}>
              <span className={styles.label}>Release Date</span>
              <span className={styles.value}>{content.releaseDate}</span>
            </div>
          </div>

          {typeof content.runtime === 'number' && content.runtime > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='clock' strokeColor='white' />
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
                <Icon name='languages' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Language</span>
                <span className={styles.value}>
                  {fullLangLabel ? fullLangLabel : content.language}
                </span>
              </div>
            </div>
          )}

          {content.productionCountry && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='globe' strokeColor='white' />
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
                <Icon name='tv-alt' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Seasons</span>
                <span className={styles.value}>{content.numberOfSeasons}</span>
              </div>
            </div>
          )}
          {content.numberOfEpisodes && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='film' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Episodes</span>
                <span className={styles.value}>{content.numberOfEpisodes}</span>
              </div>
            </div>
          )}
          {typeof data?.totalReviews === 'number' && data?.totalReviews > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='user' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Total Reviews</span>
                <span className={styles.value}>
                  {data?.totalReviews.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {typeof data?.watchlistCount === 'number' &&
            data?.watchlistCount > 0 && (
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon name='bookmark' strokeColor='white' />
                </div>
                <div className={styles.titleBlock}>
                  <span className={styles.label}>Watchlist Count</span>
                  <span className={styles.value}>
                    {data?.watchlistCount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

          {typeof data?.platformRate === 'number' && data?.platformRate > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='star' strokeColor='secondary' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Cineverse Score</span>
                <span className={styles.value}>{data?.platformRate * 10}%</span>
              </div>
            </div>
          )}

          {content.status && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='status' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Status</span>
                <span className={styles.value}>{content.status}</span>
              </div>
            </div>
          )}
          {providers && providers.length > 0 && (
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon name='tv-alt' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>You can watch on</span>
                <span className={styles.value}>
                  {providers.map((provider, index) => {
                    return (
                      <div className={styles.imageWrapper} key={index}>
                        <Image src={provider.logo} alt={provider.name} fill />
                      </div>
                    );
                  })}
                </span>
              </div>
            </div>
          )}
          {genreList && (
            <div
              className={`${styles.card} ${
                genreList.length >= 2 ? styles.cardWide : ''
              }`}
            >
              <div className={styles.iconWrapper}>
                <Icon name='badge' strokeColor='white' />
              </div>
              <div className={styles.titleBlock}>
                <span className={styles.label}>Genres</span>
                <span className={styles.value}>
                  {genreList.map((genre, index) => (
                    <Badge
                      key={index}
                      text={genre}
                      backgroundColor='bg-white'
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
