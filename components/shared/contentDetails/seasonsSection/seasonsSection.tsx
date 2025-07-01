'use client';

import { useRef, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import styles from './seasonsSection.module.css';
import { Icon, IconName } from '../../../ui/icon/icon';
import Button from '../../../ui/button/button';
import Card from '../../../cards/card/card';
import { Season } from '@/constants/types/movie';
import { useRouter } from 'next/navigation';
import { seriesStore } from '@/utils/seriesStore';
import { useStore } from '@tanstack/react-store';
import EpisodesSection from './episodeSection';

type SeasonsSectionProps = {
  data: Season[];
  seriesId?: number;
};

export default function SeasonsSection({
  data,
  seriesId,
}: SeasonsSectionProps) {
  const seriesData = useStore(seriesStore).series;
  const [selectedSeason, setSelectedSeason] = useState<number>(
    data?.[0]?.seasonNumber ?? 1
  );
  const seasonTabsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const currentSeason = useMemo(
    () => data.find(season => season.seasonNumber === selectedSeason),
    [data, selectedSeason]
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
                  subtitle={
                    season.numberOfEpisodes > 0
                      ? season.releaseDate
                        ? `${season.numberOfEpisodes} episodes • ${
                            season.releaseDate.split('-')[0]
                          }`
                        : `${season.numberOfEpisodes} episodes`
                      : season.releaseDate
                      ? `${season.releaseDate.split('-')[0]}`
                      : undefined
                  }
                  badges={[
                    {
                      iconName: 'star' as IconName,
                      color: 'secondary',
                      number: Number(season.imdbRate.toFixed(1)),
                      position: 'top-left',
                    },
                  ]}
                  imageUrl={season.posterPath || seriesData?.posterPath}
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
        <EpisodesSection
          seasonNumber={selectedSeason}
          seriesId={seriesId!}
          fallbackPoster={currentSeason?.posterPath || seriesData?.posterPath}
          seasonsData={data}
        />
      </div>
    </section>
  );
}
