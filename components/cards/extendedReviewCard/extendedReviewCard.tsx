'use client';

import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './extendedReviewCard.module.css';
import { Icon } from '../../ui/icon/icon';
import Button from '../../ui/button/button';
import StarRating from '../../ui/starRating/starRating';
import Badge from '../../ui/badge/badge';
import type { ExtendedReview, UserReview } from '@/constants/types/movie';
import fallbackImage from '@/public/avatar_fallback.png';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import { useAuth } from '@/hooks/useAuth';

type ExtendedReviewCardProps = {
  review: ExtendedReview | UserReview ;
  onReact?: (reviewId: number, type: 'LIKE' | 'DISLIKE') => void;
  onUserClick?: (username: string) => void;
  onContentClick?: (contentId: number, contentType: string) => void;
  onEdit?: (
    reviewId: number,
    updatedReview: {
      title: string;
      description: string;
      rate: number;
      spoiler: boolean;
    }
  ) => void;
  onDelete?: (reviewId: number) => void;
  showFullDescription?: boolean;
  showUserInfo?: boolean;
  showContentInfo?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
};

export default function ExtendedReviewCard({
  review,
  onReact,
  onUserClick,
  onContentClick,
  onEdit,
  onDelete,
  showFullDescription = false,
  showUserInfo = true,
  showContentInfo = true,
  className = '',
  onClick,
  href,
}: ExtendedReviewCardProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showFullDescription);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const isMobile = useResponsiveLayout();

  // Type guard to check if review has user info
  const hasUserInfo = (
    review: ExtendedReview | UserReview
  ): review is ExtendedReview => {
    return 'user' in review;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const avatarToUse =
    hasAvatarError || !hasUserInfo(review) || !review.user?.imageUrl
      ? fallbackImage
      : review.user.imageUrl;

  const posterToUse =
    hasPosterError || !review.contentPosterUrl
      ? fallbackImage
      : review.contentPosterUrl;

  const shouldShowReadMore =
    review.description.length > 300 && !showFullDescription;

  const displayDescription =
    shouldShowReadMore && !isExpanded
      ? review.description.slice(0, 300) + '...'
      : review.description;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      if (onClick) onClick();
      else if (href) router.push(href);
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUserInfo(review)) {
      onUserClick?.(review.user.username || 'unknown_user');
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContentClick?.(review.contentId, review.contentType);
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSpoilerReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpoilerRevealed(true);
  };

  const renderImage = () => (
    <div className={styles.imageWrapper} onClick={handleContentClick}>
      <Image
        src={posterToUse}
        alt={review.contentTitle}
        fill
        onError={() => setHasPosterError(true)}
        className={styles.posterImage}
        sizes='(max-width: 768px) 100vw, 180px'
        style={{ opacity: 1 }}
      />
    </div>
  );

  const renderAuthorSection = () => {
    if (!hasUserInfo(review) || !showUserInfo) return null;

    return (
      <div className={styles.authorSection} onClick={handleUserClick}>
        <span className={styles.authorText}>By</span>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            <Image
              src={avatarToUse}
              alt={review.user?.name || 'User'}
              fill
              onError={() => setHasAvatarError(true)}
              className={styles.avatarImage}
              sizes='24px'
            />
          </div>
          <span className={styles.authorName}>
            {review.user?.name || review.user?.username}
          </span>
        </div>
        <span className={styles.reviewDate}>
          • {formatDate(review.createdAt)}
        </span>
      </div>
    );
  };

  return (
    <div className={`${styles.cardWrapper} ${className}`} onClick={handleClick}>
      {showContentInfo && renderImage()}

      <div className={styles.contentDetails}>
        {/* Content Header */}
        {showContentInfo && (
          <div className={styles.contentHeader} onClick={handleContentClick}>
            <div className={styles.contentInfo}>
              <h2 className={styles.contentTitle}>{review.contentTitle}</h2>
              <Badge
                text={review.contentType}
                backgroundColor='bg-primary'
                color='color-white'
                size='size-md'
                borderRadius='border-full'
              />
            </div>
            <StarRating
              rating={review.rate}
              size='md'
              showSparkles={true}
              animated={true}
            />
          </div>
        )}

        {/* Star Rating when content info is hidden */}
        {!showContentInfo && (
          <div className={styles.ratingOnly}>
            <StarRating
              rating={review.rate}
              size='md'
              showSparkles={true}
              animated={true}
            />
          </div>
        )}

        {/* Review Meta */}
        <div className={styles.reviewMeta}>
          {renderAuthorSection()}

          {/* Review Title */}
          <h3 className={styles.reviewTitle}>{review.title}</h3>
        </div>

        {/* Review Description with Spoiler Handling */}
        <div className={styles.reviewDescriptionContainer}>
          {review.spoiler && !spoilerRevealed ? (
            <div
              className={styles.spoilerOverlay}
              onClick={handleSpoilerReveal}
            >
              <div className={styles.spoilerContent}>
                <Icon name='eye' className={styles.spoilerIcon} />
                <span className={styles.spoilerText}>Contains Spoilers</span>
                <span className={styles.spoilerSubtext}>Click to reveal</span>
              </div>
            </div>
          ) : (
            <p className={styles.reviewDescription}>{displayDescription}</p>
          )}
        </div>

        {shouldShowReadMore && (spoilerRevealed || !review.spoiler) && (
          <button
            className={styles.readMoreButton}
            onClick={handleReadMoreClick}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.reactions}>
            {' '}
            <Button
              padding='sm'
              variant='ghost'
              color={review.userReaction === 'LIKE' ? 'primary' : 'neutral'}
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                requireAuth(() => {
                  onReact?.(review.reviewId, 'LIKE');
                }, 'Please log in to like reviews');
              }}
            >
              <Icon
                name='thumbUp'
                strokeColor={
                  review.userReaction === 'LIKE' ? 'primary' : 'white'
                }
              />
              <span>{review.likeCount}</span>
            </Button>
            <Button
              padding='sm'
              variant='ghost'
              color={review.userReaction === 'DISLIKE' ? 'danger' : 'neutral'}
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                requireAuth(() => {
                  onReact?.(review.reviewId, 'DISLIKE');
                }, 'Please log in to dislike reviews');
              }}
            >
              <Icon
                name='thumbDown'
                strokeColor={
                  review.userReaction === 'DISLIKE' ? 'danger' : 'white'
                }
              />
              <span>{review.dislikeCount}</span>
            </Button>
          </div>

          {/* Edit and Delete buttons for profile view */}
          {(onEdit || onDelete) && (
            <div className={styles.editActions}>
              {!showUserInfo && (
                <span className={styles.reviewDate}>
                  {formatDate(review.createdAt)}
                </span>
              )}
              {onEdit && (
                <Button
                  padding='sm'
                  variant='ghost'
                  color='primary'
                  borderRadius='fullRadius'
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(review.reviewId, {
                      title: review.title,
                      description: review.description,
                      rate: review.rate,
                      spoiler: review.spoiler,
                    });
                  }}
                >
                  <Icon name='edit' strokeColor='white' />
                </Button>
              )}
              {onDelete && (
                <Button
                  padding='sm'
                  variant='ghost'
                  color='danger'
                  borderRadius='fullRadius'
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(review.reviewId);
                  }}
                >
                  <Icon name='trash' strokeColor='white' />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
