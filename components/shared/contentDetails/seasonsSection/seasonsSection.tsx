'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@tanstack/react-store';

import styles from './seasonsSection.module.css';
import { Icon, IconName } from '@/components/ui/icon/icon';
import Card from '@/components/cards/card/card';
import { Season } from '@/constants/types/movie';
import { seriesStore } from '@/utils/seriesStore';
import EpisodesSection from './episodeSection';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import Badge from '@/components/ui/badge/badge';

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
  const pathname = usePathname();
  const router = useRouter();

  const currentSeason = useMemo(
    () => data.find(season => season.seasonNumber === selectedSeason),
    [data, selectedSeason]
  );

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>

      <div className={styles.container}>
        <div className={styles.sliderRow}>
          <GridContainer
            layout='grid'
            cardMinWidth={270}
            cardCount={data.length}
            scrollRows={1}
          >
            {data.map(season => {
              const subtitle =
                season.numberOfEpisodes > 0
                  ? season.releaseDate
                    ? `${season.numberOfEpisodes} episodes • ${
                        season.releaseDate.split('-')[0]
                      }`
                    : `${season.numberOfEpisodes} episodes`
                  : season.releaseDate
                  ? `${season.releaseDate.split('-')[0]}`
                  : undefined;

              return (
                <Card
                  key={season.id}
                  title={season.title}
                  subtitle={subtitle}
                  description={season.overview}
                  imageUrl={season.posterUrl || seriesData?.posterUrl}
                  imageHeight='image-lg'
                  layout='overlay'
                  highlight={season.seasonNumber === selectedSeason}
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                  badges={[
                    {
                      iconName: 'star' as IconName,
                      color: 'secondary',
                      number: Number(season.imdbRate.toFixed(1)),
                      position: 'top-left',
                    },
                  ]}
                  additionalButton={{
                    iconName: 'ExternalLink',
                    onClick: () =>
                      router.push(`${pathname}/seasons/${season.seasonNumber}`),
                  }}
                  minWidth={270}
                  maxWidth={400}
                >
                  <div className={styles.contentDetails}>
                    {season.releaseDate && (
                      <div className={styles.date}>
                        <Icon name='calendar' strokeColor='muted' width={16} />
                        <span>{season.releaseDate?.split('-')[0]}</span>
                      </div>
                    )}
                    <div className={styles.genres}>
                      {seriesData &&
                        seriesData.genres
                          .slice(0, 3)
                          .map(genre => (
                            <Badge
                              key={genre}
                              text={genre}
                              color='color-white'
                              backgroundColor='bg-muted'
                              className={styles.genreBadge}
                            />
                          ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </GridContainer>
        </div>
        <EpisodesSection
          seasonNumber={selectedSeason}
          seriesId={seriesId!}
          fallbackPoster={currentSeason?.posterUrl || seriesData?.posterUrl}
          seasonsData={data}
        />
      </div>
    </section>
  );
}
