'use client';
import Image from 'next/image';
import type React from 'react';

import { useState } from 'react';
import styles from './userReviewCard.module.css';
import { Icon } from '../../ui/icon/icon';
import Button from '../../ui/button/button';
import fallbackImage from '@/public/avatar_fallback.png';
import type { UserReview } from '@/constants/types/movie';

type UserReviewCardProps = {
  review: UserReview;
  onClick?: () => void;
  onDelete?: (reviewId: number) => void;
  onEdit?: (
    reviewId: number,
    updatedReview: {
      title: string;
      description: string;
      rate: number;
      spoiler: boolean;
    },
    onSuccess?: () => void
  ) => void;
  onReact?: (reviewId: number, type: 'LIKE' | 'DISLIKE') => void;
  href?: string;
};

type EditFormData = {
  title: string;
  description: string;
  rate: number;
  spoiler: boolean;
};

export default function UserReviewCard({
  review,
  onClick,
  onDelete,
  onEdit,
  onReact,
  href,
}: UserReviewCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: review.title,
    description: review.description,
    rate: review.rate,
    spoiler: review.spoiler,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const imageToUse =
    hasError || !review.contentPosterPath
      ? fallbackImage
      : review.contentPosterPath;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number = review.rate, interactive = false) => {
    const totalStars = interactive ? 10 : 5;

    return Array.from({ length: totalStars }).map((_, i) => {
      // If interactive: 1–10 rating
      // If not: each of the 5 stars represents 2 points
      const starValue = interactive ? i + 1 : (i + 1) * 2;

      return (
        <span
          key={i}
          onClick={
            interactive
              ? () =>
                  setEditFormData(prev => ({
                    ...prev,
                    rate: starValue,
                  }))
              : undefined
          }
          className={interactive ? styles.starWrapperInteractive : undefined}
        >
          <Icon
            name='starFilled'
            className={
              rating >= starValue
                ? interactive
                  ? styles.starFilledInteractive
                  : styles.starFilled
                : interactive
                ? styles.starEmptyInteractive
                : styles.starEmpty
            }
          />
        </span>
      );
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && onClick) {
      onClick();
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(review.reviewId);
    }
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEdit) return;

    setIsSubmitting(true);
    try {
      await onEdit(review.reviewId, editFormData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    // Reset form data to original values
    setEditFormData({
      title: review.title,
      description: review.description,
      rate: review.rate,
      spoiler: review.spoiler,
    });
  };

  return (
    <>
      <div className={styles.userReviewCard} onClick={handleClick}>
        <div className={styles.wideLayout}>
          <div className={styles.wideImage}>
            <Image
              src={imageToUse || '/placeholder.svg'}
              alt={review.contentTitle}
              fill
              onError={() => setHasError(true)}
              className={styles.posterImage}
              sizes='(max-width: 768px) 100vw, 200px'
            />
          </div>
          <div className={styles.wideDetails}>
            <div className={styles.contentHeader}>
              <h3 className={styles.contentTitle}>{review.contentTitle}</h3>
              <span className={styles.contentType}>{review.contentType}</span>
            </div>
            <div className={styles.reviewHeader}>
              <h4 className={styles.reviewTitle}>{review.title}</h4>
              <div className={styles.ratingContainer}>
                <div className={styles.stars}>{renderStars()}</div>
                <span className={styles.rateNumber}>{review.rate}/10</span>
              </div>
            </div>
            <p className={styles.reviewDescription}>{review.description}</p>
            {review.spoiler && (
              <div className={styles.spoilerWarning}>
                <Icon name='alertTriangle' strokeColor='secondary' />
                <span>Contains Spoilers</span>
              </div>
            )}
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
              <div className={styles.footerRight}>
                <span className={styles.date}>
                  {formatDate(review.createdAt)}
                </span>
                <Button
                  padding='sm'
                  variant='ghost'
                  color='primary'
                  borderRadius='fullRadius'
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <Icon name='edit' strokeColor='white' />
                </Button>
                <Button
                  padding='sm'
                  variant='ghost'
                  color='danger'
                  borderRadius='fullRadius'
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Icon name='trash' strokeColor='white' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Review</h2>
              <Button
                variant='ghost'
                color='neutral'
                padding='sm'
                borderRadius='fullRadius'
                onClick={handleModalClose}
              >
                <Icon name='close' strokeColor='white' />
              </Button>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor='reviewTitle' className={styles.formLabel}>
                  Review Title
                </label>
                <input
                  id='reviewTitle'
                  type='text'
                  value={editFormData.title}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className={styles.formInput}
                  required
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='reviewDescription' className={styles.formLabel}>
                  Review Description
                </label>
                <textarea
                  id='reviewDescription'
                  value={editFormData.description}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={styles.formTextarea}
                  required
                  maxLength={1000}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rating</label>
                <div className={styles.ratingInput}>
                  <div className={styles.interactiveStars}>
                    {renderStars(editFormData.rate, true)}
                  </div>
                  <span className={styles.rateNumber}>
                    {editFormData.rate}/10
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    checked={editFormData.spoiler}
                    onChange={e =>
                      setEditFormData(prev => ({
                        ...prev,
                        spoiler: e.target.checked,
                      }))
                    }
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Contains Spoilers</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <Button
                  type='button'
                  variant='ghost'
                  color='neutral'
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='solid'
                  color='primary'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCancelDelete}>
          <div
            className={styles.deleteModalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.deleteModalHeader}>
              <Icon name='alertTriangle' className={styles.warningIcon} />
              <h2 className={styles.deleteModalTitle}>Delete Review</h2>
            </div>

            <div className={styles.deleteModalBody}>
              <p className={styles.deleteModalText}>
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
              <div className={styles.reviewPreview}>
                <strong>"{review.title}"</strong>
                <span className={styles.reviewMeta}>
                  for {review.contentTitle} • {formatDate(review.createdAt)}
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
                Delete Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
