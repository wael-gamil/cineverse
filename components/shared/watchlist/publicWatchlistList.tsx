'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicUserWatchlistQuery } from '@/hooks/usePublicUserWatchlistQuery';
import { useContentSummary } from '@/hooks/useContentSummary';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import Card from '@/components/cards/card/card';
import Pagination from '@/components/ui/pagination/pagination';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import styles from './watchList.module.css';
import { WatchlistItem } from '@/constants/types/movie';

type PublicWatchlistListProps = {
  username: string;
  status: 'TO_WATCH' | 'WATCHED';
  page?: number;
};

export default function PublicWatchlistList({
  username,
  status,
  page = 0,
}: PublicWatchlistListProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);

  const { data, isLoading, isError } = usePublicUserWatchlistQuery({
    username,
    status,
    page,
    size: 24,
  });

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useContentSummary(
    selectedItem?.contentId ?? 0,
    selectedItem?.contentType ?? 'MOVIE',
    !!selectedItem
  );

  // Navigate once we have the summary
  useEffect(() => {
    if (summaryData && selectedItem) {
      const slug = summaryData.slug;
      let path = `/${slug}`;

      if (summaryData.seasonNumber)
        path += `/seasons/${summaryData.seasonNumber}`;
      if (summaryData.episodeNumber)
        path += `/episodes/${summaryData.episodeNumber}`;

      router.push(path);
      setSelectedItem(null);
      setSelectedId(null);
    }
  }, [summaryData, selectedItem, router]);

  const handleCardClick = (item: WatchlistItem) => {
    if (selectedId === item.contentId) return;

    setSelectedId(item.contentId);
    setSelectedItem(item);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    const placeholders = Array.from({ length: 8 });

    return (
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={8}
      >
        {placeholders.map((_, i) => (
          <SkeletonCard
            key={i}
            layout='overlay'
            imageHeight='image-lg'
            minWidth={250}
            maxWidth={500}
          />
        ))}
      </GridContainer>
    );
  }

  if (isError || !data?.items?.length) {
    return (
      <p className={styles.emptyMessage}>
        {status === 'TO_WATCH'
          ? `${username} has no items in their watchlist yet.`
          : `${username} has no watched content yet.`}
      </p>
    );
  }

  const totalPages = data.totalPages;
  const currentPage = data.currentPage;

  return (
    <>
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={data.items.length}
      >
        {' '}
        {data.items.map((item: WatchlistItem) => (
          <div key={item.id} className={styles.cardWrapper}>
            <Card
              title={item.title}
              description={item.overview}
              imageUrl={item.contentPosterUrl}
              layout='overlay'
              imageHeight='image-lg'
              onClick={() => handleCardClick(item)}
              badges={[
                {
                  number: Number(item.imdbRate.toFixed(1)),
                  iconName: 'star',
                  color: 'secondary',
                  position: 'top-right',
                },
              ]}
            />
          </div>
        ))}
      </GridContainer>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}
