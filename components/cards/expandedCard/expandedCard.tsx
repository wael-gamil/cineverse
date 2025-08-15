'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './expandedCard.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Badge from '@/components/ui/badge/badge';
import {
  Movie,
  Series,
  Content,
  NormalizedContent,
  normalizeContent,
} from '@/constants/types/movie';
import { useContentDetailsQuery } from '@/hooks/useContentDetailsQuery';
import { useAddToWatchlistMutation } from '@/hooks/useAddToWatchlistMutation';
import fallbackImage from '@/public/avatar_fallback.png';
import { useFilterOptionsQuery } from '@/hooks/useFilterOptionsQuery';
import { useWatchlistActionMutation } from '@/hooks/useWatchlistActionMutation';
import { useWatchlistExistsQuery } from '@/hooks/useWatchlistExistsQuery';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ExpandedCardProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
  cardPosition: DOMRect;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExpandedCard({
  content: rawContent,
  isOpen,
  onClose,
  cardPosition,
  containerRef,
}: ExpandedCardProps) {
  const router = useRouter();
  const expandedRef = useRef<HTMLDivElement>(null);
  // position now tracks an optional bottom-anchored mode to avoid bottom overflow
  const [position, setPosition] = useState({
    top: cardPosition.top, // numeric top for internal calculations
    left: cardPosition.left,
    direction: 'right',
    useBottom: false as boolean,
    bottomOffset: 0 as number, // if using bottom anchoring we can store offset
  });
  const { isAuthenticated, requireAuth } = useAuth();
  const [isAnimating, setIsAnimating] = useState(true); // Start with true to show initial scale(0) state
  const [isClosing, setIsClosing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatches by only showing loading states after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const { data: details, isLoading } = useContentDetailsQuery(rawContent.slug);
  const content = details ? normalizeContent(details) : null;
  const { mutate: addToWatchlist, isPending: isAddingToWatchlist } =
    useAddToWatchlistMutation();
  const { mutate: removeFromWatchlist, isPending: isRemovingFromWatchlist } =
    useWatchlistActionMutation();
  const { data: watchlistId = null, isLoading: isCheckingWatchlist } =
    useWatchlistExistsQuery(rawContent.id, isAuthenticated);

  const isInWatchlist = watchlistId !== null;

  const isPending = isAddingToWatchlist || isRemovingFromWatchlist;
  const handleAddToWatchlist = () => {
    if (
      !requireAuth(() => {}, 'Please log in to add items to your watchlist')
    ) {
      return;
    }

    const addPromise = new Promise<void>((resolve, reject) => {
      addToWatchlist(rawContent.id, {
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
        { mode: 'delete', id: watchlistId, contentId: rawContent.id },
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

  // Recalculate position when content loads to handle size changes
  useEffect(() => {
    if (!isOpen) return;

    const expandedWidth = 400;
    const expandedHeight = content ? 650 : 500;
    const padding = 40;

    let left = cardPosition.left;
    let top = cardPosition.top;
    let direction = 'right';
    let growDirection = 'down'; // Track if we grow up or down
    let useBottom = false;
    let bottomOffset = 0;

    // Horizontal positioning
    if (cardPosition.left + expandedWidth > window.innerWidth - padding) {
      left = cardPosition.right - expandedWidth;
      direction = 'left';
    }

    if (left < padding) {
      left = padding;
      direction = 'right';
    }

    // Vertical positioning - enhanced logic for bottom cards
    const availableHeight = window.innerHeight - 120;
    const cardBottom = cardPosition.bottom;
    const cardTop = cardPosition.top;

    // Check if card is in bottom third of screen
    const isBottomCard = cardTop > window.innerHeight * 0.6;

    if (isBottomCard) {
      // For bottom cards: grow upward from card bottom
      const expandedTop = cardBottom - expandedHeight;

      if (expandedTop >= 120) {
        // Can fit growing upward
        top = expandedTop;
        growDirection = 'up';
      } else {
        // Can't fit growing upward, position from top
        top = 120;
        growDirection = 'down';
      }
    } else {
      // For top/middle cards: normal logic (grow downward)
      if (cardPosition.top + expandedHeight <= availableHeight) {
        // Fits below, use card position but respect navbar
        top = Math.max(cardPosition.top, 120);
        growDirection = 'down';
      } else {
        // Check if we can grow upward instead
        const expandedTop = cardBottom - expandedHeight;
        if (expandedTop >= 120) {
          top = expandedTop;
          growDirection = 'up';
        } else {
          // Neither direction works well, position to fit on screen
          top = Math.max(120, availableHeight - expandedHeight);
          growDirection = 'down';
        }
      }
    }

    // Final safety checks
    // If the card would still overflow the bottom, anchor it to the bottom of the viewport
    if (top + expandedHeight > window.innerHeight) {
      // Use bottom anchoring to ensure the expanded card bottom aligns with viewport bottom
      useBottom = true;
      bottomOffset = 0; // anchor to bottom:0 as requested
      // keep an internal top value for transform-origin calculations
      top = Math.max(0, window.innerHeight - expandedHeight - bottomOffset);
    }

    if (top < 120) {
      top = 120;
      useBottom = false; // if we clamped to top, don't anchor to bottom
      bottomOffset = 0;
    }

    // Only update position if it's actually different
    setPosition(prev => {
      if (
        prev.top !== top ||
        prev.left !== left ||
        prev.direction !== direction ||
        prev.useBottom !== useBottom ||
        prev.bottomOffset !== bottomOffset
      ) {
        return { top, left, direction, useBottom, bottomOffset } as any;
      }
      return prev as any;
    });
  }, [
    isOpen,
    cardPosition.top,
    cardPosition.left,
    cardPosition.right,
    cardPosition.bottom,
    !!content,
    isLoading,
  ]);

  // Handle animations
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow positioning to be calculated and applied first
      const timer = setTimeout(() => {
        setIsAnimating(false); // This will remove the expanding class and start the scale animation
      }, 16); // One frame delay

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside and scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        expandedRef.current &&
        !expandedRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    const handleScroll = () => {
      handleClose();
    };

    // Add a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose]);

  const handleViewDetails = () => {
    router.push(`/${rawContent.slug}`); // Using ID instead of slug for now
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  if (!isOpen) return null;

  // Calculate transform origin based on card's actual position and grow direction
  const cardCenterX =
    cardPosition.left + (cardPosition.right - cardPosition.left) / 2;
  const cardCenterY =
    cardPosition.top + (cardPosition.bottom - cardPosition.top) / 2;

  // Determine if this card is growing upward (bottom card)
  const isBottomCard = cardPosition.top > window.innerHeight * 0.6;
  const expandedHeight = content ? 650 : 500;
  const isGrowingUpward =
    isBottomCard && cardPosition.bottom - expandedHeight >= 120;

  let originX, originY;

  if (isGrowingUpward) {
    // When growing upward, transform-origin should be at bottom of expanded card
    originX = Math.max(0, Math.min(cardCenterX - position.left, 400));
    // For upward growth, origin Y should be at the bottom (full height)
    const cardBottomRelativeToExpanded = cardPosition.bottom - position.top;
    originY = Math.max(
      0,
      Math.min(cardBottomRelativeToExpanded, expandedHeight)
    );
  } else {
    // Normal downward growth
    originX = Math.max(0, Math.min(cardCenterX - position.left, 400));
    originY = Math.max(0, Math.min(cardCenterY - position.top, expandedHeight));
  }

  // If we decided to anchor to bottom (useBottom) render with bottom:0 to avoid overflow
  const expandedStyle: any = position.useBottom
    ? {
        left: `${position.left}px`,
        bottom: `${position.bottomOffset || 0}px`,
        transformOrigin: `${originX}px ${originY}px`,
      }
    : {
        top: `${position.top}px`,
        left: `${position.left}px`,
        transformOrigin: `${originX}px ${originY}px`,
      };

  const runtime: string =
    typeof content?.runtime === 'number' && !isNaN(content.runtime)
      ? (() => {
          const totalMinutes = content.runtime;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return hours > 0
            ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
            : `${minutes}m`;
        })()
      : typeof content?.runtime === 'string'
      ? content.runtime
      : '';
  const { data: filterOptions } = useFilterOptionsQuery();
  const languageData = filterOptions?.find(item => item.key === 'lang');
  const fullLangLabel = languageData?.options?.find(
    opt => opt.value === content?.language
  )?.label;
  return (
    <div className={`${styles.overlay} ${isAnimating ? styles.animating : ''}`}>
      <div
        ref={expandedRef}
        className={`${styles.expandedCard} ${
          isAnimating ? styles.expanding : ''
        } ${isClosing ? styles.closing : ''}`}
        style={expandedStyle}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label='Close expanded view'
        >
          <Icon name='close' strokeColor='white' />
        </button>

        {/* Backdrop Image */}
        {content?.backgroundUrl && (
          <div className={styles.backdropSection}>
            <Image
              src={content?.backgroundUrl || fallbackImage}
              alt={rawContent.title}
              fill
              className={styles.backdropImage}
              sizes='400px'
            />
            <div className={styles.backdropGradient} />
          </div>
        )}

        {/* Content Section */}
        <div className={styles.contentSection}>
          {isLoading ? (
            // Skeleton Loading State
            <div className={styles.skeletonContent}>
              <div className={styles.posterAndInfo}>
                {/* Mini Poster Skeleton */}
                <div className={styles.miniPoster}>
                  <div className={styles.skeletonPoster} />
                </div>

                {/* Title and Meta Skeleton */}
                <div className={styles.titleSection}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.metadata}>
                    <div className={styles.skeletonBadge} />
                    <div className={styles.skeletonBadge} />
                  </div>
                  <div className={styles.genres}>
                    <div className={styles.skeletonGenre} />
                    <div className={styles.skeletonGenre} />
                    <div className={styles.skeletonGenre} />
                  </div>
                </div>
              </div>

              {/* Overview Skeleton */}
              <div className={styles.overview}>
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonTextShort} />
              </div>

              {/* Details Grid Skeleton */}
              <div className={styles.detailsGrid}>
                <div className={styles.skeletonDetailBadge} />
                <div className={styles.skeletonDetailBadge} />
                <div className={styles.skeletonDetailBadge} />
                <div className={styles.skeletonDetailBadge} />
              </div>

              {/* Action Buttons Skeleton */}
              <div className={styles.actionButtons}>
                <div className={styles.skeletonButton} />
                <div className={styles.skeletonButton} />
              </div>
            </div>
          ) : (
            // Actual Content
            <>
              <div className={styles.posterAndInfo}>
                {/* Mini Poster */}
                <div className={styles.miniPoster}>
                  <Image
                    src={rawContent.posterUrl || fallbackImage}
                    alt={rawContent.title}
                    fill
                    className={styles.posterImage}
                    sizes='80px'
                  />
                </div>

                {/* Title and Meta */}
                <div className={styles.titleSection}>
                  <h3 className={styles.title}>{content?.title}</h3>
                  <div className={styles.metadata}>
                    {typeof rawContent.releaseDate === 'string' &&
                      rawContent.releaseDate > '0' && (
                        <Badge
                          text={rawContent.releaseDate.split('-')[0]}
                          iconName='calendar'
                          backgroundColor='bg-white'
                          size='size-md'
                        />
                      )}
                    {typeof rawContent.imdbRate === 'number' &&
                      rawContent.imdbRate > 0 && (
                        <Badge
                          iconName='starFilled'
                          text='IMDB'
                          number={Number(rawContent.imdbRate.toFixed(1))}
                          backgroundColor='bg-white'
                          size='size-md'
                        />
                      )}
                  </div>

                  {/* Genres */}
                  <div className={styles.genres}>
                    {rawContent.genres?.slice(0, 3).map(genre => (
                      <Badge
                        key={genre}
                        text={genre}
                        color='color-white'
                        backgroundColor='bg-white'
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className={styles.overview}>
                <p>
                  {details?.overview ||
                    rawContent.overview ||
                    'No overview available.'}
                </p>
              </div>

              {/* Additional Details */}
              <div className={styles.detailsGrid}>
                {/* Runtime */}
                {content &&
                  typeof content.runtime === 'number' &&
                  content.runtime > 0 && (
                    <Badge
                      text={runtime}
                      iconName='clock'
                      backgroundColor='bg-primary'
                      size='size-md'
                      className={styles.runtimeBadge}
                    />
                  )}

                {/* Language */}
                {content?.language && (
                  <Badge
                    text={fullLangLabel}
                    iconName='languages'
                    backgroundColor='bg-primary'
                    size='size-md'
                  />
                )}

                {/* Status */}
                {content?.status && (
                  <Badge
                    text={content.status}
                    iconName='status'
                    backgroundColor='bg-primary'
                    size='size-md'
                    className={styles.statusBadge}
                  />
                )}

                {/* Seasons/Episodes for series */}
                {content?.numberOfSeasons && (
                  <Badge
                    text={`Seasons: ${content.numberOfSeasons.toString()}`}
                    iconName='tv-alt'
                    backgroundColor='bg-primary'
                    size='size-md'
                    className={styles.seasonsBadge}
                  />
                )}

                {content?.numberOfEpisodes && (
                  <Badge
                    text={`Episodes: ${content.numberOfEpisodes.toString()}`}
                    iconName='film'
                    backgroundColor='bg-primary'
                    size='size-md'
                    className={styles.episodesBadge}
                  />
                )}

                {/* Production Country */}
                {content?.productionCountry && (
                  <Badge
                    text={content.productionCountry}
                    iconName='globe'
                    backgroundColor='bg-primary'
                    size='size-md'
                    className={styles.countryBadge}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <Button
                  variant='solid'
                  color='primary'
                  onClick={handleViewDetails}
                  ariaLabel='View full details'
                  width='100%'
                >
                  <Icon name='eye' strokeColor='white' />
                  View Full Details
                </Button>
                <Button
                  variant='ghost'
                  color={isInWatchlist ? 'danger' : 'primary'}
                  disabled={isPending || (isHydrated && isCheckingWatchlist)}
                  onClick={
                    isInWatchlist
                      ? handleRemoveFromWatchlist
                      : handleAddToWatchlist
                  }
                  width='100%'
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
