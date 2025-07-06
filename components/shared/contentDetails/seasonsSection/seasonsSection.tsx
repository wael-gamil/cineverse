'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@tanstack/react-store';

import styles from './seasonsSection.module.css';
import { Icon, IconName } from '@/components/ui/icon/icon';
import Button from '@/components/ui/button/button';
import Card from '@/components/cards/card/card';
import { Season } from '@/constants/types/movie';
import { seriesStore } from '@/utils/seriesStore';
import EpisodesSection from './episodeSection';
import CardContainer from '@/components/cards/card/cardContainer';
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
  const [cardsPerView, setCardsPerView] = useState(6);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const currentSeason = useMemo(
    () => data.find(season => season.seasonNumber === selectedSeason),
    [data, selectedSeason]
  );

  const visibleSeasons = useMemo(() => {
    return data.slice(visibleStartIndex, visibleStartIndex + cardsPerView);
  }, [data, visibleStartIndex, cardsPerView]);

  const handlePrev = () => {
    setVisibleStartIndex(prev => Math.max(prev - cardsPerView, 0));
  };

  const handleNext = () => {
    const nextStart = visibleStartIndex + cardsPerView;
    if (nextStart < data.length) {
      setVisibleStartIndex(nextStart);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>

      <div className={styles.container}>
        <div className={styles.sliderRow}>
          <Button
            onClick={handlePrev}
            variant='outline'
            color='neutral'
            disabled={visibleStartIndex === 0}
          >
            <Icon name='arrow-left' strokeColor='white' />
          </Button>

          <CardContainer
            layout='scroll'
            cardMinWidth={250}
            cardGap={16}
            setCardsPerView={setCardsPerView}
          >
            {visibleSeasons.map(season => {
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
                  imageUrl={season.posterPath || seriesData?.posterPath}
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
                  minWidth={250}
                  maxWidth={300}
                >
                  <div className={styles.contentDetails}>
                    <div className={styles.date}>
                      <Icon name='calendar' strokeColor='muted' width={16} />
                      <span>{season.releaseDate?.split('-')[0]}</span>
                    </div>
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
          </CardContainer>

          <Button
            onClick={handleNext}
            variant='outline'
            color='neutral'
            disabled={visibleStartIndex + cardsPerView >= data.length}
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
