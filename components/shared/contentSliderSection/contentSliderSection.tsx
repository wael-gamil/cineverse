'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './contentSliderSection.module.css';
import Button from '@/components/ui/button/button';
import { Icon, IconName } from '@/components/ui/icon/icon';
import Card, { CardProps } from '@/components/cards/card/card';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import FilterTabs from '@/components/ui/filter/filterTabs';
import { Content } from '@/constants/types/movie';
import { useSliderQuery } from '@/hooks/useSliderQuery';
import EmptyCard from '@/components/cards/card/emptyCard';
import SectionHeader from './sectionHeader';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import Badge from '@/components/ui/badge/badge';
import ExpandedCard from '@/components/cards/expandedCard/expandedCard';

type FilterType = 'ALL' | 'MOVIE' | 'SERIES';

type HeaderVariant = 'block' | 'strip' | 'lined' | 'ghost';

type ContentSliderSectionProps = {
  title: string;
  fetchUrl: string;
  initialFilter?: FilterType;
  initialData?: Content[];
  initialTotalElements?: number;
  showAllFilter?: boolean;
  enabled?: boolean;
  header?: {
    variant?: HeaderVariant;
    subtitle?: string;
    icon?: React.ReactNode;
  };
  cardProps?: Partial<
    Omit<
      CardProps,
      'title' | 'imageUrl' | 'description' | 'subtitle' | 'href' | 'badges'
    >
  >;
  showUpcomingBadge?: boolean;
};

export default function ContentSliderSection({
  title,
  fetchUrl,
  initialData = [],
  initialTotalElements,
  initialFilter = 'ALL',
  showAllFilter = true,
  enabled,
  header,
  cardProps,
  showUpcomingBadge,
}: ContentSliderSectionProps) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [fetchedContent, setFetchedContent] = useState<Content[]>(initialData);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCard, setExpandedCard] = useState<{
    isOpen: boolean;
    content: Content | null;
    cardPosition: DOMRect | null;
  }>({
    isOpen: false,
    content: null,
    cardPosition: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const [totalElementsByFilter, setTotalElementsByFilter] = useState<
    Record<FilterType, number | undefined>
  >(() => ({
    ALL: initialFilter === 'ALL' ? initialTotalElements : undefined,
    MOVIE: initialFilter === 'MOVIE' ? initialTotalElements : undefined,
    SERIES: initialFilter === 'SERIES' ? initialTotalElements : undefined,
  }));
  // derived current totalElements for rendering
  const totalElements = totalElementsByFilter[filter] ?? fetchedContent.length;
  const isMobile = useResponsiveLayout();
  const minWidth = isMobile ? 200 : cardProps?.minWidth || 270;
  const [animation, setAnimation] = useState<'slideLeft' | 'slideRight'>(
    'slideLeft'
  );
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isNextCooldown, setIsNextCooldown] = useState(false);
  const nextCooldownRef = useRef<number | null>(null);
  const NEXT_ANIMATION_COOLDOWN_MS = 400;

  useEffect(() => {
    return () => {
      if (nextCooldownRef.current) {
        clearTimeout(nextCooldownRef.current);
      }
    };
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const container = entries[0].target as HTMLDivElement;
      const cardWidth = minWidth + 16;
      const count = Math.floor(container.offsetWidth / cardWidth);
      setCardsPerView(count);
    });

    return () => observer.disconnect();
  }, []);

  const { data, isLoading, isFetching } = useSliderQuery(
    fetchUrl,
    title,
    page,
    filter,
    enabled
  );

  useEffect(() => {
    if (isFetching || isLoading) {
      setIsNextCooldown(true);
      return;
    }

    if (!nextCooldownRef.current) {
      setIsNextCooldown(false);
    }
  }, [isFetching, isLoading]);
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
      setFetchedContent(prev => {
        const ids = new Set(prev.map(c => c.id));
        const merged = [...prev];
        for (const c of data.content) {
          if (!ids.has(c.id)) merged.push(c);
        }
        return merged;
      });

      if (typeof data.totalElements === 'number') {
        setTotalElementsByFilter(prev => {
          if (prev[filter] === undefined) {
            return { ...prev, [filter]: data.totalElements };
          }
          return prev;
        });
      }

      const canShowMore =
        visibleStartIndex + cardsPerView <
        fetchedContent.length + data.content.length;
      if (page > 0 && canShowMore) {
        setVisibleStartIndex(prev => prev + cardsPerView);
      }
    }
  }, [data, filter]);
  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    setPage(0);
    setFetchedContent([]);
    setVisibleStartIndex(0);
  };

  const handleNext = () => {
    if (isNextCooldown) return;
    setAnimation('slideRight');
    setShouldAnimate(true);
    const nextStartIndex = visibleStartIndex + cardsPerView;
    const nextSlice = fetchedContent.slice(
      nextStartIndex,
      nextStartIndex + cardsPerView
    );
    if (nextSlice.length === cardsPerView) {
      setVisibleStartIndex(nextStartIndex);
      setIsNextCooldown(true);
      nextCooldownRef.current = window.setTimeout(() => {
        setIsNextCooldown(false);
        nextCooldownRef.current = null;
      }, NEXT_ANIMATION_COOLDOWN_MS);
      return;
    }

    if (page + 1 < totalPages) {
      setPage(prev => prev + 1);
      setIsNextCooldown(true);
    } else if (nextSlice.length > 0) {
      setVisibleStartIndex(nextStartIndex);
      setIsNextCooldown(true);
      nextCooldownRef.current = window.setTimeout(() => {
        setIsNextCooldown(false);
        nextCooldownRef.current = null;
      }, NEXT_ANIMATION_COOLDOWN_MS);
    }
  };

  const handlePrev = () => {
    setAnimation('slideLeft');
    setShouldAnimate(true);
    setVisibleStartIndex(prev => Math.max(prev - cardsPerView, 0));
  };

  const handleInfoClick = (e: React.MouseEvent | undefined, item: Content) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get the card element position
      const target = e.currentTarget as HTMLElement;
      const cardElement =
        target.closest('.card') || target.closest('[class*="cardWrapper"]');
      if (cardElement) {
        const cardRect = cardElement.getBoundingClientRect();
        setExpandedCard({
          isOpen: true,
          content: item,
          cardPosition: cardRect,
        });
      }
    }
  };

  const closeExpandedCard = () => {
    setExpandedCard({
      isOpen: false,
      content: null,
      cardPosition: null,
    });
  };

  const visibleContent = fetchedContent.slice(
    visibleStartIndex,
    Math.min(visibleStartIndex + cardsPerView, fetchedContent.length)
  );
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const displayedEnd = Math.min(
    visibleStartIndex + cardsPerView,
    fetchedContent.length,
    typeof totalElements === 'number' ? totalElements : Infinity
  );
  return (
    <div ref={containerRef} className={styles.wrapper}>
      <SectionHeader
        title={title}
        subtitle={header?.subtitle}
        icon={header?.icon}
        variant={header?.variant || 'block'}
        filterTabs={
          <FilterTabs
            options={[
              { label: 'Movies', value: 'MOVIE' },
              { label: 'Series', value: 'SERIES' },
            ]}
            active={filter}
            onChange={handleFilterChange}
            showAll={showAllFilter}
          />
        }
      />

      <div className={styles.sliderRow}>
        {!isMobile && (
          <Button
            onClick={handlePrev}
            variant='outline'
            color='neutral'
            disabled={visibleStartIndex === 0}
            title='Previous Slide'
          >
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
        )}

        <GridContainer
          layout='scroll'
          cardMinWidth={minWidth}
          cardMaxWidth={cardProps?.maxWidth}
          cardCount={cardsPerView}
          cardGap={16}
          setCardsPerView={setCardsPerView}
          lastPage={
            visibleStartIndex + cardsPerView >= fetchedContent.length &&
            page + 1 >= totalPages
          }
          animation={shouldAnimate ? animation : null}
        >
          {(isLoading || (isFetching && visibleContent.length === 0)) &&
            Array.from({ length: cardsPerView }).map((_, idx) => (
              <SkeletonCard
                key={idx}
                layout={cardProps?.layout}
                imageHeight={cardProps?.imageHeight}
                maxWidth={cardProps?.maxWidth}
                minWidth={minWidth}
              />
            ))}

          {!isFetching && !isLoading && fetchedContent.length === 0 && (
            <EmptyCard
              maxWidth={cardProps?.maxWidth}
              minWidth={minWidth}
              minHeight={cardProps?.imageHeight}
            />
          )}

          {!isFetching &&
            !isLoading &&
            visibleContent.length > 0 &&
            visibleContent.map(item => {
              const isUpcoming =
                !!item.releaseDate &&
                new Date(item.releaseDate).getTime() > Date.now();
              return (
                <Card
                  key={item.id}
                  title={item.title}
                  subtitle={item.releaseDate?.split('-')[0]}
                  description={item.overview}
                  imageUrl={item.posterUrl}
                  href={`/${item.slug}`}
                  badges={[
                    {
                      iconName: 'star' as IconName,
                      color: 'secondary',
                      number: Number(item.imdbRate.toFixed(1)),
                      position: 'top-left',
                    },
                    {
                      iconName: 'calendar' as IconName,
                      text:
                        isUpcoming && showUpcomingBadge
                          ? 'Upcoming'
                          : undefined,
                      color: 'primary',
                      position: 'top-left',
                    },
                  ]}
                  additionalButton={{
                    iconName: 'info',
                    onClick: e => handleInfoClick(e, item),
                  }}
                  {...cardProps}
                >
                  <div className={styles.contentDetails}>
                    <div className={styles.date}>
                      <Icon name='calendar' strokeColor='muted' width={16} />
                      <span>{item.releaseDate?.split('-')[0]}</span>
                    </div>
                    <div className={styles.genres}>
                      {item.genres.slice(0, 3).map(genre => (
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

        {!isMobile && (
          <Button
            onClick={handleNext}
            variant='outline'
            color='neutral'
            disabled={
              (visibleStartIndex + cardsPerView >= fetchedContent.length &&
                page + 1 >= totalPages) ||
              isNextCooldown
            }
            title='Next Slide'
          >
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        )}
      </div>
      {isMobile && (
        <div className={styles.mobileControls}>
          <Button
            onClick={handlePrev}
            variant='outline'
            color='neutral'
            disabled={visibleStartIndex === 0}
            title='Previous Slide'
          >
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
          <Button
            onClick={handleNext}
            variant='outline'
            color='neutral'
            disabled={
              (visibleStartIndex + cardsPerView >= fetchedContent.length &&
                page + 1 >= totalPages) ||
              isNextCooldown
            }
            title='Next Slide'
          >
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>
      )}
      <div className={styles.pageInfo}>
        Showing {visibleStartIndex + 1} – {displayedEnd} of{' '}
        {totalElements ?? fetchedContent.length}
      </div>

      {/* Expanded Card */}
      {expandedCard.isOpen &&
        expandedCard.content &&
        expandedCard.cardPosition && (
          <ExpandedCard
            content={expandedCard.content}
            isOpen={expandedCard.isOpen}
            onClose={closeExpandedCard}
            cardPosition={expandedCard.cardPosition}
            containerRef={containerRef}
          />
        )}
    </div>
  );
}
