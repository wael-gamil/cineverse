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
}: ContentSliderSectionProps) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [fetchedContent, setFetchedContent] = useState<Content[]>(initialData);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const isMobile = useResponsiveLayout();
  const minWidth = isMobile ? 200 : cardProps?.minWidth || 270;
  const [animation, setAnimation] = useState<'slideLeft' | 'slideRight'>(
    'slideLeft'
  );
  const [shouldAnimate, setShouldAnimate] = useState(false);
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

      const canShowMore =
        visibleStartIndex + cardsPerView <
        fetchedContent.length + data.content.length;
      if (page > 0 && canShowMore) {
        setVisibleStartIndex(prev => prev + cardsPerView);
      }
    }
  }, [data]);

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    setPage(0);
    setFetchedContent([]);
    setVisibleStartIndex(0);
  };

  const handleNext = () => {
    setAnimation('slideRight');
    setShouldAnimate(true);
    const nextStartIndex = visibleStartIndex + cardsPerView;
    const nextSlice = fetchedContent.slice(
      nextStartIndex,
      nextStartIndex + cardsPerView
    );
    if (nextSlice.length === cardsPerView) {
      setVisibleStartIndex(nextStartIndex);
      return;
    }

    if (page + 1 < totalPages) {
      setPage(prev => prev + 1);
    } else if (nextSlice.length > 0) {
      setVisibleStartIndex(nextStartIndex);
    }
  };

  const handlePrev = () => {
    setAnimation('slideLeft');
    setShouldAnimate(true);
    setVisibleStartIndex(prev => Math.max(prev - cardsPerView, 0));
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
  return (
    <div className={styles.wrapper}>
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

      <div
        className={styles.sliderRow}
        style={
          isMobile
            ? cardProps?.imageHeight === 'image-lg'
              ? { minHeight: '550px', maxHeight: '550px' }
              : { minHeight: '450px', maxHeight: '450px' }
            : undefined
        }
      >
        {!isMobile && (
          <Button
            onClick={handlePrev}
            variant='outline'
            color='neutral'
            disabled={visibleStartIndex === 0}
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
            visibleContent.map(item => (
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
                ]}
                {...cardProps}
              />
            ))}
        </GridContainer>

        {!isMobile && (
          <Button
            onClick={handleNext}
            variant='outline'
            color='neutral'
            disabled={
              visibleStartIndex + cardsPerView >= fetchedContent.length &&
              page + 1 >= totalPages
            }
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
          >
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
          <Button
            onClick={handleNext}
            variant='outline'
            color='neutral'
            disabled={
              visibleStartIndex + cardsPerView >= fetchedContent.length &&
              page + 1 >= totalPages
            }
          >
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>
      )}
      <div className={styles.pageInfo}>
        Showing {visibleStartIndex + 1} –{' '}
        {Math.min(visibleStartIndex + cardsPerView, fetchedContent.length)} of{' '}
        {initialTotalElements || data?.totalElements}
      </div>
    </div>
  );
}
