'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWatchlistActionMutation } from '@/hooks/useWatchlistActionMutation';
import { useContentSummary } from '@/hooks/useContentSummary';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import Card from '@/components/cards/card/card';
import Button from '@/components/ui/button/button';
import Pagination from '@/components/ui/pagination/pagination';
import { Icon } from '@/components/ui/icon/icon';
import DeleteConfirmationModal from '@/components/ui/deleteConfirmationModal/deleteConfirmationModal';
import toast from 'react-hot-toast';
import styles from '../../../components/shared/watchlist/watchList.module.css';
import { WatchlistItem } from '@/constants/types/movie';
import EmptyCard from '@/components/cards/card/emptyCard';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type WatchlistServerListProps = {
  status: 'TO_WATCH' | 'WATCHED';
  initialData:
    | {
        items: WatchlistItem[];
        totalPages: number;
        totalElements: number;
        currentPage: number;
      }
    | undefined;
};

export default function WatchlistServerList({
  status,
  initialData,
}: WatchlistServerListProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WatchlistItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  // Use initial data from server directly
  const data = initialData;
  const isMobile = useResponsiveLayout();

  const { mutate: watchlistAction } = useWatchlistActionMutation();
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useContentSummary(
    selectedItem?.contentId ?? 0,
    selectedItem?.contentType ?? 'MOVIE', // Default to 'MOVIE' to avoid TS error
    !!selectedItem // only fetch if item is selected
  );

  const handleMoveToWatched = async (watchlistId: number) => {
    const updatePromise = new Promise<void>((resolve, reject) => {
      watchlistAction(
        {
          mode: 'update',
          payload: { watchlistId, status: 'WATCHED' },
        },
        {
          onSuccess: () => {
            resolve();
            // Refresh the page to get updated data
            router.refresh();
          },
          onError: err => {
            reject(err);
          },
        }
      );
    });

    await toast.promise(
      updatePromise,
      {
        loading: 'Updating...',
        success: 'Moved to Watched!',
        error: 'Failed to update.',
      },
      { className: 'toast-default' }
    );
  };

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
    }
  }, [summaryData, selectedItem, router]);

  const handleDeleteClick = (item: WatchlistItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const deletePromise = new Promise<void>((resolve, reject) => {
      watchlistAction(
        {
          mode: 'delete',
          id: itemToDelete.id,
        },
        {
          onSuccess: () => {
            resolve();
            // Refresh the page to get updated data
            router.refresh();
            setDeleteModalOpen(false);
            setItemToDelete(null);
          },
          onError: err => {
            reject(err);
          },
        }
      );
    });

    await toast.promise(
      deletePromise,
      {
        loading: 'Removing...',
        success: 'Removed from watchlist!',
        error: 'Failed to remove.',
      },
      { className: 'toast-default' }
    );
  };
  const handleContentClick = (item: WatchlistItem) => {
    setSelectedItem(item);
  };

  if (!data || !data.items) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load watchlist. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={data.items.length}
        scrollRows={isMobile ? 1 : undefined}
      >
        {data.items.length === 0 && (
          <EmptyCard maxWidth={250} minWidth={250} minHeight={'image-lg'} />
        )}
        {data.items.map((item: WatchlistItem) => {
          return (
            <Card
              key={item.id}
              imageUrl={item.contentPosterUrl}
              title={item.title}
              badges={[
                {
                  iconName: 'star',
                  color: 'secondary',
                  number: Number(item.imdbRate.toFixed(1)),
                  position: 'top-left',
                },
                {
                  color: 'secondary',
                  position: 'top-right',
                  text:
                    item.contentType.charAt(0).toUpperCase() +
                    item.contentType.slice(1).toLowerCase(),
                },
              ]}
              onClick={() => handleContentClick(item)}
              layout='below'
              minWidth={250}
              maxWidth={500}
            >
              <div className={styles.cardContent}>
                {status === 'TO_WATCH' ? (
                  <>
                    <Button
                      variant='solid'
                      color='secondary'
                      size='sm'
                      padding='md'
                      onClick={e => {
                        e.stopPropagation();
                        handleMoveToWatched(item.id);
                      }}
                    >
                      Mark as Watched
                    </Button>
                    <Button
                      variant='ghost'
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteClick(item, e);
                      }}
                      color='danger'
                      padding='sm'
                      title='Remove from watchlist'
                    >
                      <Icon name='trash' strokeColor='white' />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='solid'
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteClick(item, e);
                    }}
                    color='danger'
                    padding='sm'
                    width='100%'
                  >
                    <Icon name='trash' strokeColor='white' />
                    delete
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </GridContainer>
      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
        />
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen && !!itemToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Remove from Watchlist'
        message={`Are you sure you want to remove "${itemToDelete?.title}" from your watchlist? This action cannot be undone.`}
        confirmText='Remove'
      />
    </>
  );
}
