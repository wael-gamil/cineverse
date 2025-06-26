'use client';

import { useRef, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import styles from './seasonsSection.module.css';
import { Icon, IconName } from '../../../ui/icon/icon';
import Button from '../../../ui/button/button';
import Card from '../../../cards/card/card';
import { Season, Episode, Series } from '@/app/constants/types/movie';
import { useRouter } from 'next/navigation';
import SkeletonCard from '@/app/components/cards/card/skeletonCard';
import { seriesStore } from '@/app/utils/seriesStore';
import { useStore } from '@tanstack/react-store';
import { useEpisodeQuery } from '@/app/hooks/useEpisodeQuery';

type SeasonsSectionProps = {
  data: Season[];
  seriesId?: number;
};

export default function SeasonsSection({
  data,
  seriesId,
}: SeasonsSectionProps) {
  const seriesData: Series = useStore(seriesStore);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    data?.[0]?.seasonNumber ?? 1
  );
  const [expanded, setExpanded] = useState(true);
  const seasonTabsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const currentSeason = useMemo(
    () => data.find(season => season.seasonNumber === selectedSeason),
    [data, selectedSeason]
  );
  const { data: episodes = [] as Episode[], isLoading } = useEpisodeQuery(
    seriesId!,
    selectedSeason,
    !!currentSeason
  );
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
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.seasonTabs}>
          <Button
            onClick={() => scrollSeasonTabs('left')}
            variant='outline'
            color='neutral'
          >
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
          <div className={styles.seasonCardsWrapper} ref={seasonTabsRef}>
            <div className={styles.seasonCards}>
              {data.map(season => (
                <Card
                  key={season.id}
                  title={season.title}
                  subtitle={`${season.numberOfEpisodes} episodes • ${
                    season.releaseDate.split('-')[0]
                  }`}
                  badges={[
                    {
                      iconName: 'star' as IconName,
                      color: 'secondary',
                      number: Number(season.imdbRate.toFixed(1)),
                      position: 'top-left',
                    },
                  ]}
                  imageUrl={
                    season.posterPath ||
                    seriesData?.posterPath ||
                    '/images/placeholder.jpg'
                  }
                  additionalButton={{
                    iconName: 'ExternalLink',
                    onClick: () => {
                      router.push(`${pathname}/seasons/${season.seasonNumber}`);
                    },
                  }}
                  imageHeight='image-md'
                  description={season.overview}
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                  layout='overlay'
                  highlight={season.seasonNumber === selectedSeason}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={() => scrollSeasonTabs('right')}
            variant='outline'
            color='neutral'
          >
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>
        <div className={styles.episodesSection}>
          <div className={styles.episodesHeader}>
            <div className={styles.episodesHeading}>
              <h3>Episodes</h3>
            </div>
            <Button color='neutral' onClick={() => setExpanded(!expanded)}>
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                strokeColor='white'
              />
              {expanded ? 'Hide' : 'Show'} Episodes
            </Button>
          </div>
          {expanded && (
            <div className={styles.episodesGrid}>
              {!isLoading
                ? episodes.map(episode => (
                    <Card
                      key={episode.id}
                      title={episode.title}
                      subtitle={episode.releaseDate}
                      description={episode.overview}
                      href={`${pathname}/seasons/${selectedSeason}/episodes/${episode.episodeNumber}`}
                      imageUrl={
                        episode.posterPath ||
                        currentSeason?.posterPath ||
                        '/placeholder.svg'
                      }
                      badges={[
                        {
                          iconName: 'film' as IconName,
                          color: 'primary',
                          text: 'episode',
                          number: episode.episodeNumber,
                          position: 'top-left',
                        },
                        {
                          iconName: 'clock' as IconName,
                          number: episode.runTime,
                          position: 'top-right',
                        },
                      ]}
                      imageHeight='image-md'
                      layout='below'
                    />
                  ))
                : Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
