'use client';
import styles from './seasonsSection.module.css';
import { Episode, Season } from '@/constants/types/movie';
import Card from '@/components/cards/card/card';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Icon, { IconName } from '@/components/ui/icon/icon';
import { useStore } from '@tanstack/react-store';
import { useEpisodeQuery } from '@/hooks/useEpisodeQuery';
import { seriesStore } from '@/utils/seriesStore';
import { useMemo, useState } from 'react';
import Button from '@/components/ui/button/button';
import { usePathname } from 'next/navigation';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import EmptyCard from '@/components/cards/card/emptyCard';

type EpisodesSectionProps = {
  seasonNumber: number;
  seriesId: number;
  fallbackPoster?: string;
  seasonsData: Season[];
  episodesData?: Episode[];
};

export default function EpisodesSection({
  seasonNumber,
  seriesId,
  fallbackPoster,
  seasonsData,
  episodesData,
}: EpisodesSectionProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const seriesData = useStore(seriesStore).series;

  const currentSeason = useMemo(
    () => seasonsData.find(season => season.seasonNumber === seasonNumber),
    [seasonsData, seasonNumber]
  );

  const shouldFetch = !episodesData;
  const { data: fetchedEpisodes = [], isLoading } = useEpisodeQuery(
    seriesId,
    seasonNumber,
    !!currentSeason && shouldFetch
  );

  const episodes = episodesData ?? fetchedEpisodes;

  return (
    <div
      className={` ${episodesData ? styles.section : styles.episodesSection} `}
    >
      <div className={styles.episodesHeader}>
        <div className={styles.episodesHeading}>
          <h3>Episodes - Season {seasonNumber}</h3>
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
        <GridContainer layout='grid' cardMinWidth={270} scrollRows={1}>
          {episodes.length > 0 ? (
            episodes.map(episode => {
              const runtime: string =
                typeof episode.runTime === 'number' && !isNaN(episode.runTime)
                  ? (() => {
                      const totalMinutes = episode.runTime;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return hours > 0
                        ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
                        : `${minutes}m`;
                    })()
                  : typeof episode.runTime === 'string'
                  ? episode.runTime
                  : '';
              return (
                <Card
                  key={episode.id}
                  title={episode.title}
                  subtitle={episode.releaseDate}
                  description={episode.overview}
                  href={`${pathname}/${
                    !episodesData ? 'seasons/' + seasonNumber + '/' : ''
                  }episodes/${episode.episodeNumber}`}
                  imageUrl={
                    episode.posterUrl ||
                    currentSeason?.posterUrl ||
                    fallbackPoster ||
                    seriesData?.posterUrl
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
                      text: runtime,
                      position: 'top-right',
                    },
                  ]}
                  imageHeight='image-md'
                  layout='below'
                  minWidth={270}
                  maxWidth={300}
                />
              );
            })
          ) : isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard
                key={i}
                imageHeight='image-md'
                layout='below'
                maxWidth={300}
                minWidth={270}
              />
            ))
          ) : (
            <EmptyCard maxWidth={300} minWidth={270} />
          )}
        </GridContainer>
      )}
    </div>
  );
}
