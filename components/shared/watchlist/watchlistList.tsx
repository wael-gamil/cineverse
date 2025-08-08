'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { useWatchlistQuery } from '@/hooks/useWatchlistQuery';
import { useWatchlistActionMutation } from '@/hooks/useWatchlistActionMutation';
import { useContentSummary } from '@/hooks/useContentSummary';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import Card from '@/components/cards/card/card';
import Button from '@/components/ui/button/button';
import Pagination from '@/components/ui/pagination/pagination';
import { Icon } from '@/components/ui/icon/icon';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import DeleteConfirmationModal from '@/components/ui/deleteConfirmationModal/deleteConfirmationModal';
import toast from 'react-hot-toast';
import styles from './watchList.module.css';
import { WatchlistItem } from '@/constants/types/movie';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import EmptyCard from '@/components/cards/card/emptyCard';

type WatchlistItemProp = {
  status: 'TO_WATCH' | 'WATCHED';
};

export default function WatchlistList({ status }: WatchlistItemProp) {
  const { username } = useStore(userStore);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WatchlistItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const isMobile = useResponsiveLayout();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, isError, refetch } = useWatchlistQuery(
    username ?? '',
    status,
    page,
    24,
    !!username
  );

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
            refetch();
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
            refetch();
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
        loading: 'Removing from watchlist...',
        success: 'Removed from watchlist!',
        error: 'Failed to remove item.',
      },
      { className: 'toast-default' }
    );
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isClient) return null;

  if (!username) {
    return (
      <p className={styles.emptyMessage}>
        You must be logged in to view your watchlist.
      </p>
    );
  }
  if (isLoading) {
    const placeholders = Array.from({ length: 8 });

    return (
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={8}
        scrollRows={isMobile ? 1 : undefined}
      >
        {placeholders.map((_, i) => (
          <SkeletonCard
            key={i}
            layout='overlay'
            imageHeight='image-md'
            minWidth={250}
            maxWidth={500}
          />
        ))}
      </GridContainer>
    );
  }

  return (
    <>
      <GridContainer
        layout='grid'
        cardGap={26}
        cardMinWidth={250}
        cardMaxWidth={500}
        cardCount={data?.items.length}
        scrollRows={isMobile ? 1 : undefined}
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard
              key={i}
              layout='overlay'
              imageHeight='image-md'
              minWidth={250}
              maxWidth={500}
            />
          ))}
        {(isError || !data?.items?.length) && (
          <EmptyCard maxWidth={250} minWidth={250} minHeight={'image-lg'} />
        )}
        {data?.items.map(item => (
          <Card
            key={item.id}
            title={item.title}
            imageUrl={item.contentPosterUrl || '/images/placeholder.jpg'}
            layout='below'
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
            onClick={() => {
              setSelectedId(item.id);
              setSelectedItem(item);
            }}
            className={
              selectedId === null
                ? ''
                : item.id === selectedId
                ? styles.activeCard
                : styles.inactiveCard
            }
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
        ))}
      </GridContainer>
      {data?.items.length !== 0 && (
        <Pagination
          currentPage={data?.currentPage || 0}
          totalPages={data?.totalPages || 1}
        />
      )}{' '}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen && !!itemToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Remove from Watchlist'
        message='Are you sure you want to remove this item from your watchlist? This action cannot be undone.'
        itemPreview={
          itemToDelete ? (
            <div>
              <strong>"{itemToDelete.title}"</strong>
              <div
                style={{
                  color: 'var(--color-muted)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--space-xs)',
                }}
              >
                {itemToDelete.contentType} • Added{' '}
                {formatDate(itemToDelete.createdAt)}
              </div>
            </div>
          ) : null
        }
        confirmText='Remove Item'
      />
    </>
  );
}
