// components/hero/HeroMetadata.tsx
'use client';

import styles from './contentHero.module.css';
import { NormalizedContent } from '@/constants/types/movie';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import Image from 'next/image';
import Link from 'next/link';
import { useAddToWatchlistMutation } from '@/hooks/useAddToWatchlistMutation';
import { useWatchlistActionMutation } from '@/hooks/useWatchlistActionMutation';
import { useWatchlistExistsQuery } from '@/hooks/useWatchlistExistsQuery';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
type Props = {
  content: NormalizedContent;
  runtime: string;
  fallbackPoster?: string;
  showPoster?: boolean;
  trailerAvailable?: boolean;
  isMuted?: boolean;
  onPlayTrailer?: () => void;
  onToggleMute?: () => void;
  onShare?: () => void;
  genres?: string[];
  className?: string;
  showExternalLink?: boolean;
  slug?: string;
};

export default function HeroMetadata({
  content,
  runtime,
  fallbackPoster,
  showPoster = false,
  trailerAvailable = false,
  isMuted = true,
  onPlayTrailer,
  onToggleMute,
  onShare,
  genres,
  className = '',
  showExternalLink,
  slug,
}: Props) {
  const { isAuthenticated, requireAuth } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatches by only showing loading states after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const genreList = content.genres || genres || [];
  const { mutate: addToWatchlist, isPending: isAddingToWatchlist } =
    useAddToWatchlistMutation();
  const { mutate: removeFromWatchlist, isPending: isRemovingFromWatchlist } =
    useWatchlistActionMutation();
  const { data: watchlistId = null, isLoading: isCheckingWatchlist } =
    useWatchlistExistsQuery(content.id, isAuthenticated);

  // Check if content is in watchlist (watchlistId is a number when in watchlist, null when not)
  const isInWatchlist = watchlistId !== null;

  const isPending = isAddingToWatchlist || isRemovingFromWatchlist;
  const handleAddToWatchlist = () => {
    if (
      !requireAuth(() => {}, 'Please log in to add items to your watchlist')
    ) {
      return;
    }

    const addPromise = new Promise<void>((resolve, reject) => {
      addToWatchlist(content.id, {
        onSuccess: () => {
          resolve();
        },
        onError: (err: any) => {
          reject(err);
        },
      });
    });

    toast.promise(
      addPromise,
      {
        loading: 'Adding to watchlist...',
        success: 'Added to watchlist!',
        error: 'Failed to add to watchlist.',
      },
      {
        className: 'toast-default',
      }
    );
  };
  const handleRemoveFromWatchlist = () => {
    if (!requireAuth(() => {}, 'Please log in to manage your watchlist')) {
      return;
    }

    if (!watchlistId) return; // Don't attempt removal if no watchlistId

    const removePromise = new Promise<void>((resolve, reject) => {
      removeFromWatchlist(
        { mode: 'delete', id: watchlistId, contentId: content.id },
        {
          onSuccess: data => {
            resolve();
          },
          onError: (err: any) => {
            reject(err);
          },
        }
      );
    });

    toast.promise(
      removePromise,
      {
        loading: 'Removing from watchlist...',
        success: 'Removed from watchlist!',
        error: 'Failed to remove from watchlist.',
      },
      {
        className: 'toast-default',
      }
    );
  };

  return (
    <div className={`${styles.rightSection} ${className}`}>
      {showPoster && (
        <div className={styles.posterWrapper}>
          <Image
            src={content.imageUrl || fallbackPoster || ''}
            alt={content.title}
            fill
            className={styles.posterImage}
          />
        </div>
      )}

      <div className={styles.metaHeader}>
        <Link href={`/${slug}`}>
          <h1 className={styles.title}>{content.title}</h1>
        </Link>
        {showExternalLink && (
          <div className={styles.externalLink}>
            <Button variant='ghost' padding='sm' borderRadius='fullRadius'>
              <Link href={`/${slug}`} target='_blank'>
                <Icon name='ExternalLink' strokeColor='muted' />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className={styles.infoRow}>
        {typeof content.imdbRate === 'number' && content.imdbRate > 0 && (
          <Badge
            iconName='starFilled'
            text='IMDB'
            color='color-primary'
            number={Number(content.imdbRate.toFixed(1))}
            iconColor='secondary'
            backgroundColor='bg-muted'
            size='size-lg'
            className={styles.imdbBadge}
          />
        )}

        {typeof content.releaseDate === 'string' &&
          content.releaseDate > '0' && (
            <Badge
              text={content.releaseDate.split('-')[0]}
              iconName='calendar'
              backgroundColor='bg-muted'
              size='size-lg'
            />
          )}

        {typeof content.runtime === 'number' && content.runtime > 0 && (
          <Badge
            text={runtime}
            iconName='clock'
            backgroundColor='bg-muted'
            size='size-lg'
            className={styles.runtimeBadge}
          />
        )}

        {content.status && (
          <div
            className={`${styles.status} ${
              content.status === 'Continuing'
                ? styles.statusGreen
                : content.status === 'Ended'
                ? styles.statusRed
                : ''
            }`}
          >
            {content.status}
          </div>
        )}
      </div>
      {genreList && (
        <div className={styles.genreList}>
          {genreList.map(genre => (
            <Badge
              key={genre}
              text={genre}
              iconName='badge'
              color='color-white'
              backgroundColor='bg-white'
              className={styles.genreBadge}
              size='size-lg'
              borderRadius='border-full'
            />
          ))}
        </div>
      )}

      {content.description && (
        <p className={styles.description}>{content.description}</p>
      )}

      <div className={styles.actions}>
        {trailerAvailable && onPlayTrailer && (
          <Button color='primary' onClick={onPlayTrailer}>
            <Icon name='play' strokeColor='white' />
            Play Trailer
          </Button>
        )}{' '}
        <Button
          color='neutral'
          disabled={isPending || (isHydrated && isCheckingWatchlist)}
          onClick={
            isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist
          }
        >
          {isHydrated && isCheckingWatchlist ? (
            <>
              <Icon name='loader' strokeColor='white' />
              Loading...
            </>
          ) : (
            <>
              <Icon
                name={isInWatchlist ? 'trash' : 'bookmark'}
                strokeColor='white'
              />
              {isPending
                ? isInWatchlist
                  ? 'Removing...'
                  : 'Adding...'
                : isInWatchlist
                ? 'Remove from Watchlist'
                : 'Add to Watchlist'}
            </>
          )}
        </Button>
        <Button color='neutral' onClick={onShare}>
          <Icon name='share' strokeColor='white' />
        </Button>
        {trailerAvailable && onToggleMute && (
          <Button color='neutral' onClick={onToggleMute}>
            <Icon name={isMuted ? 'mute' : 'speaker'} strokeColor='white' />
          </Button>
        )}
      </div>
    </div>
  );
}
