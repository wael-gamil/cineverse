'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { useWatchlistQuery } from '@/hooks/useWatchlistQuery';
import { useWatchlistActionMutation } from '@/hooks/useWatchlistActionMutation';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import Card from '@/components/cards/card/card';
import Button from '@/components/ui/button/button';
import Pagination from '@/components/ui/pagination/pagination';
import { Icon } from '@/components/ui/icon/icon';
import toast from 'react-hot-toast';
import styles from './watchList.module.css';

type WatchlistItemProp = {
  status: 'TO_WATCH' | 'WATCHED';
};

type WatchlistItem = {
  id: number;
  title: string;
  contentType: string;
  contentPoster: string | null;
  overview: string;
  contentId: number;
  createdAt: string;
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, isError, refetch } = useWatchlistQuery(
    username ?? '',
    status,
    page,
    20,
    !!username
  );

  const { mutate: watchlistAction } = useWatchlistActionMutation();

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

  const handleCardClick = (id: number, href: string) => {
    setSelectedId(id);
    setTimeout(() => {
      router.push(href);
    }, 150);
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
    return <p className={styles.emptyMessage}>Loading...</p>;
  }

  if (isError || !data?.items?.length) {
    return (
      <p className={styles.emptyMessage}>
        {status === 'TO_WATCH'
          ? 'Your watchlist is empty. Add some content to start tracking!'
          : 'You have no watched content yet. Start watching something!'}
      </p>
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
      >
        {data.items.map(item => (
          <Card
            key={item.id}
            title={item.title}
            subtitle={item.contentType}
            imageUrl={item.contentPoster || '/images/placeholder.jpg'}
            description={item.overview}
            layout='overlay'
            actionButtons={[
              {
                iconName: 'trash',
                onClick: e => handleDeleteClick(item, e),
                color: 'danger',
                position: 'top-right',
                ariaLabel: 'Remove from watchlist',
              },
            ]}
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
            {status === 'TO_WATCH' && (
              <Button
                variant='solid'
                onClick={e => {
                  e.stopPropagation();
                  handleMoveToWatched(item.id);
                }}
              >
                Add to Watched
              </Button>
            )}
          </Card>
        ))}
      </GridContainer>

      <Pagination
        currentPage={data.currentPage || 0}
        totalPages={data.totalPages || 1}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <div className={styles.modalOverlay} onClick={handleCancelDelete}>
          <div
            className={styles.deleteModalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.deleteModalHeader}>
              <Icon name='alertTriangle' className={styles.warningIcon} />
              <h2 className={styles.deleteModalTitle}>Remove from Watchlist</h2>
            </div>

            <div className={styles.deleteModalBody}>
              <p className={styles.deleteModalText}>
                Are you sure you want to remove this item from your watchlist?
                This action cannot be undone.
              </p>
              <div className={styles.reviewPreview}>
                <strong>"{itemToDelete.title}"</strong>
                <span className={styles.reviewMeta}>
                  {itemToDelete.contentType} • Added{' '}
                  {formatDate(itemToDelete.createdAt)}
                </span>
              </div>
            </div>

            <div className={styles.deleteModalActions}>
              <Button
                type='button'
                variant='ghost'
                color='neutral'
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='solid'
                color='danger'
                onClick={handleConfirmDelete}
              >
                Remove Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
