'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import styles from './addReviewPopup.module.css';

type ReviewData = {
  contentId: number;
  rate: number;
  title: string;
  description: string;
  spoiler: boolean;
};

type AddReviewPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  contentId: number;
  contentTitle: string;
  contentPoster?: string;
  // Updated to handle both add and edit modes
  onSubmit: (
    reviewData: ReviewData,
    onClose: () => void,
    resetForm: () => void
  ) => void;
  // New props for edit mode
  mode?: 'add' | 'edit';
  initialData?: {
    reviewId?: number;
    title: string;
    description: string;
    rate: number;
    spoiler: boolean;
  };
};

export default function AddReviewPopup({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentPoster,
  onSubmit,
  mode = 'add',
  initialData,
}: AddReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize form with data when in edit mode or reset when in add mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setRating(initialData.rate);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSpoiler(initialData.spoiler);
    } else {
      resetForm();
    }
  }, [mode, initialData, isOpen]);

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setDescription('');
    setSpoiler(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: ReviewData & { reviewId?: number } = {
        contentId,
        rate: rating,
        title: title.trim(),
        description: description.trim(),
        spoiler,
        ...(mode === 'edit' &&
          initialData?.reviewId && { reviewId: initialData.reviewId }),
      };

      await onSubmit(reviewData, onClose, resetForm);

      setShowSuccess(true);
      setTimeout(() => {
        resetForm();
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 0) return 'No Rating';
    if (rating <= 3) return 'Poor';
    if (rating <= 5) return 'Fair';
    if (rating <= 7) return 'Good';
    if (rating <= 9) return 'Great';
    return 'Perfect';
  };

  // Dynamic text based on mode
  const modalTitle = mode === 'edit' ? 'Edit Review' : 'Write a Review';
  const submitButtonText = isSubmitting
    ? mode === 'edit'
      ? 'Updating...'
      : 'Submitting...'
    : mode === 'edit'
    ? 'Update Review'
    : 'Submit Review';
  const successTitle =
    mode === 'edit' ? 'Review Updated!' : 'Review Submitted!';
  const successMessage =
    mode === 'edit'
      ? 'Your review has been updated successfully.'
      : 'Thank you for sharing your thoughts.';

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role='dialog'
      aria-labelledby='review-modal-title'
      aria-describedby='review-modal-description'
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Success Message */}
        {showSuccess && (
          <div className={styles.successBanner}>
            <div className={styles.successContent}>
              <Icon name='trust-badge' className={styles.successIcon} />
              <div className={styles.successText}>
                <h3 className={styles.successTitle}>{successTitle}</h3>
                <p className={styles.successMessage}>{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={styles.modalHeader}>
          <Icon
            name={mode === 'edit' ? 'edit' : 'edit'}
            className={styles.headerIcon}
          />
          <h2 id='review-modal-title' className={styles.modalTitle}>
            {modalTitle}
          </h2>
          <Button
            variant='ghost'
            color='neutral'
            padding='sm'
            borderRadius='fullRadius'
            onClick={handleClose}
            disabled={isSubmitting}
            ariaLabel='Close modal'
            title='Close modal'
          >
            <Icon name='close' strokeColor='white' />
          </Button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Content Info Section */}
          {contentPoster && (
            <div className={styles.contentInfoSection}>
              <div className={styles.posterContainer}>
                <Image
                  src={contentPoster}
                  alt={contentTitle}
                  fill
                  className={styles.poster}
                  sizes='(max-width: 768px) 100vw, 50vw'
                  priority
                />
              </div>
              <div className={styles.contentDetails}>
                <h3 className={styles.contentTitle}>{contentTitle}</h3>
                <p className={styles.contentSubtitle}>
                  {mode === 'edit'
                    ? 'Update your thoughts about this content'
                    : 'Share your thoughts about this content'}
                </p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formContent}>
              {/* Rating Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleWrapper}>
                    <Icon
                      name='star'
                      className={styles.sectionIcon}
                      strokeColor='white'
                    />
                    <h3 className={styles.sectionTitle}>Your Rating</h3>
                  </div>
                  <div className={styles.ratingDisplay}>
                    <span className={styles.ratingValue}>{rating}/10</span>
                    <span className={styles.ratingLabel}>
                      {getRatingLabel(rating)}
                    </span>
                  </div>
                </div>
                <div className={styles.starsContainer}>
                  {Array.from({ length: 10 }).map((_, index) => {
                    const starValue = index + 1;
                    const isActive = (hoverRating || rating) >= starValue;

                    return (
                      <button
                        key={index}
                        type='button'
                        className={styles.starButton}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                        aria-label={`Rate ${starValue} out of 10`}
                        disabled={isSubmitting}
                        title={`Rate ${starValue} out of 10`}
                        style={{ minWidth: 44, minHeight: 44 }}
                      >
                        <Icon
                          name='starFilled'
                          className={`${styles.star} ${
                            isActive ? styles.starActive : styles.starInactive
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleWrapper}>
                    <Icon
                      name='edit'
                      className={styles.sectionIcon}
                      strokeColor='white'
                    />
                    <h3 className={styles.sectionTitle}>Review Title</h3>
                  </div>
                  <span className={styles.charCount}>{title.length}/100</span>
                </div>
                <input
                  type='text'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => {
                    // Ensure spaces work and don't get prevented
                    if (e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  placeholder='Give your review a catchy title...'
                  className={styles.input}
                  maxLength={100}
                  disabled={isSubmitting}
                  autoComplete='off'
                />
              </div>

              {/* Description Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleWrapper}>
                    <Icon
                      name='message-square'
                      className={styles.sectionIcon}
                      strokeColor='white'
                    />
                    <h3 className={styles.sectionTitle}>Your Review</h3>
                  </div>
                  <span className={styles.charCount}>
                    {description.length}/2000
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onKeyDown={e => {
                    // Ensure spaces work and don't get prevented
                    if (e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  placeholder='Share your detailed thoughts, what you liked, what could be better...'
                  className={styles.textarea}
                  maxLength={2000}
                  rows={6}
                  disabled={isSubmitting}
                />
              </div>

              {/* Spoiler Warning - only show if description is not empty, with transition */}
              <div
                className={
                  description.trim()
                    ? styles.spoilerSection
                    : `${styles.spoilerSection} ${styles['spoilerSection--hidden']}`
                }
                aria-hidden={!description.trim()}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    checked={spoiler}
                    onChange={e => setSpoiler(e.target.checked)}
                    className={styles.checkbox}
                    disabled={isSubmitting}
                  />
                  <div className={styles.checkboxCustom}>
                    {spoiler && (
                      <Icon
                        name='check'
                        className={styles.checkIcon}
                        strokeColor='white'
                      />
                    )}
                  </div>

                  <span className={styles.checkboxText}>
                    This review contains spoilers
                  </span>
                  <Icon
                    name='alertTriangle'
                    className={styles.warningIcon}
                    strokeColor='secondary'
                  />
                </label>
                {spoiler && (
                  <div className={styles.spoilerNote}>
                    Your review will be marked as containing spoilers to help
                    other users avoid unwanted reveals.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={styles.modalActions}>
              <Button
                type='button'
                variant='ghost'
                color='danger'
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='solid'
                color='primary'
                disabled={!title.trim() || rating === 0 || isSubmitting}
              >
                {submitButtonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
