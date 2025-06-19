'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '../../ui/icon/icon';
import styles from './seasonsSection.module.css';
import { Season, Episode } from '@/app/constants/types/movie';

type SeasonsSectionProps = {
  data: Season[];
  seriesId?: number;
};

export default function SeasonsSection({
  data,
  seriesId,
}: SeasonsSectionProps) {
  const [selectedSeason, setSelectedSeason] = useState<number | string | null>(
    data[0]?.seasonNumber
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [expanded, setExpanded] = useState(false);
  const seasonTabsRef = useRef<HTMLDivElement>(null);

  const currentSeason = data.find(
    season => season.seasonNumber === selectedSeason
  );

  useEffect(() => {
    async function fetchEpisodes() {
      console.log('Fetching episodes for season:', selectedSeason);
      if (!currentSeason) return;
      const res = await fetch(
        `/api/proxy/episodes?id=${seriesId}&seasonNumber=${currentSeason.seasonNumber}`
      );
      if (res.ok) {
        const data = await res.json();
        setEpisodes(data);
      } else {
        setEpisodes([]);
      }
    }

    fetchEpisodes();
  }, [selectedSeason]);

  const scrollSeasonTabs = (direction: 'left' | 'right') => {
    if (seasonTabsRef.current) {
      const scrollAmount = 300;
      seasonTabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Seasons & Episodes</h2>
          <p className={styles.subtitle}>
            Browse through all seasons and their episodes
          </p>
        </div>

        <div className={styles.seasonScrollWrapper}>
          <button
            onClick={() => scrollSeasonTabs('left')}
            className={styles.navLeft}
          >
            <Icon name='arrow-left' />
          </button>
          <button
            onClick={() => scrollSeasonTabs('right')}
            className={styles.navRight}
          >
            <Icon name='arrow-right' />
          </button>

          <div ref={seasonTabsRef} className={styles.seasonTabs}>
            {data.map(season => {
              const isSelected = selectedSeason === season.seasonNumber;
              return (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                  className={`${styles.seasonCard} ${
                    isSelected ? styles.selected : ''
                  }`}
                >
                  <div className={styles.posterWrapper}>
                    <Image
                      src={season.posterPath || '/placeholder.svg'}
                      alt={season.title}
                      fill
                      className={styles.poster}
                    />
                    <div className={styles.episodeCount}>
                      {season.numberOfEpisodes || 0} EP
                    </div>
                    <div className={styles.seasonNumber}>
                      S{season.seasonNumber}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{season.title}</h3>
                    <p>
                      {season.numberOfEpisodes || 0} episodes •{' '}
                      {season.releaseDate}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {currentSeason && (
          <div className={styles.seasonDetails}>
            <div className={styles.detailsCard}>
              <div>
                <h3>{currentSeason.title}</h3>
                <p className={styles.badges}>
                  <span>{episodes.length} episodes</span>
                  <span>{currentSeason.releaseDate}</span>
                </p>
                <p className={styles.overview}>{currentSeason.overview}</p>
              </div>
              <div className={styles.actionButtons}>
                <Link
                  href={`/season/${currentSeason.id}`}
                  className={styles.linkButton}
                >
                  <Icon name='ExternalLink' />
                  Full Season Page
                </Link>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={styles.toggleButton}
                >
                  {expanded ? (
                    <Icon name='chevron-up' />
                  ) : (
                    <Icon name='chevron-down' />
                  )}
                  {expanded ? 'Hide Episodes' : 'Show Episodes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {(expanded ||
          (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <div className={styles.episodesGrid}>
            {episodes.map(episode => (
              <div key={episode.id} className={styles.episodeCard}>
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={episode.posterPath || '/placeholder.svg'}
                    alt={episode.title}
                    fill
                    className={styles.thumbnail}
                  />
                  <div className={styles.episodeBadge}>
                    EP {episode.episodeNumber}
                  </div>
                  <div className={styles.durationBadge}>{episode.runTime}</div>
                </div>
                <div className={styles.episodeContent}>
                  <h4>{episode.title}</h4>
                  <p>{episode.overview}</p>
                  <div className={styles.episodeMeta}>
                    <span>
                      <Icon name='calendar' />
                      {episode.releaseDate}
                    </span>
                    <Link
                      href={`/episode/${episode.id}`}
                      className={styles.detailsButton}
                    >
                      <Icon name='ExternalLink' />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
