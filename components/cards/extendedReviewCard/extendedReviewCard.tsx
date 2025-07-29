'use client';

import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';
import styles from './extendedReviewCard.module.css';
import { Icon } from '../../ui/icon/icon';
import Button from '../../ui/button/button';
import type { ExtendedReview } from '@/constants/types/movie';

type ExtendedReviewCardProps = {
  review: ExtendedReview;
  onReact?: (reviewId: number, type: 'LIKE' | 'DISLIKE') => void;
  onUserClick?: (username: string) => void;
  onContentClick?: (contentId: number, contentType: string) => void;
  showFullDescription?: boolean;
};

export default function ExtendedReviewCard({
  review,
  onReact,
  onUserClick,
  onContentClick,
  showFullDescription = false,
}: ExtendedReviewCardProps) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showFullDescription);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        name='starFilled'
        className={rating >= (i + 1) * 2 ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const avatarToUse =
    hasAvatarError || !review.user?.imageUrl
      ? '/avatar_fallback.png'
      : review.user.imageUrl;

  const posterToUse =
    hasPosterError || !review.contentPosterUrl
      ? '/poster_fallback.png'
      : review.contentPosterUrl;

  const shouldShowReadMore =
    review.description.length > 300 && !showFullDescription;

  const displayDescription =
    shouldShowReadMore && !isExpanded
      ? review.description.slice(0, 300) + '...'
      : review.description;

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUserClick?.(review.user.username || 'unknown_user');
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContentClick?.(review.contentId, review.contentType);
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.reviewCard}>
      {/* Content Header */}
      <div className={styles.contentHeader} onClick={handleContentClick}>
        <div className={styles.poster}>
          <Image
            src={posterToUse || '/placeholder.svg'}
            alt={review.contentTitle}
            fill
            onError={() => setHasPosterError(true)}
            className={styles.posterImage}
            sizes='(max-width: 768px) 60px, 80px'
          />
        </div>
        <div className={styles.contentInfo}>
          <h2 className={styles.contentTitle}>{review.contentTitle}</h2>
          <span className={styles.contentType}>{review.contentType}</span>
        </div>
      </div>

      {/* Review Content */}
      <div className={styles.reviewContent}>
        {/* User Info */}
        <div className={styles.userInfo} onClick={handleUserClick}>
          <div className={styles.avatar}>
            <Image
              src={avatarToUse || '/placeholder.svg'}
              alt={review.user?.name || 'User'}
              fill
              onError={() => setHasAvatarError(true)}
              className={styles.avatarImage}
              sizes='(max-width: 768px) 40px, 48px'
            />
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userNameSection}>
              <h3 className={styles.userName}>{review.user?.name}</h3>
              <span className={styles.username}>@{review.user?.username}</span>
            </div>
            <div className={styles.rating}>
              <div className={styles.stars}>{renderStars(review.rate)}</div>
              <span className={styles.rateNumber}>{review.rate}/10</span>
            </div>
          </div>
        </div>

        {/* Review Details */}
        <div className={styles.reviewDetails}>
          <h4 className={styles.reviewTitle}>{review.title}</h4>
          {review.spoiler && (
            <div className={styles.spoilerWarning}>
              <Icon name='alertTriangle' strokeColor='secondary' />
              <span>Contains Spoilers</span>
            </div>
          )}
          <p className={styles.reviewDescription}>{displayDescription}</p>
          {shouldShowReadMore && (
            <button
              className={styles.readMoreButton}
              onClick={handleReadMoreClick}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Review Footer */}
        <div className={styles.reviewFooter}>
          <div className={styles.reactions}>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                onReact?.(review.reviewId, 'LIKE');
              }}
            >
              <Icon name='thumbUp' strokeColor='white' />
              <span>{review.likeCount}</span>
            </Button>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                onReact?.(review.reviewId, 'DISLIKE');
              }}
            >
              <Icon name='thumbDown' strokeColor='white' />
              <span>{review.dislikeCount}</span>
            </Button>
          </div>
          <span className={styles.date}>{formatDate(review.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
