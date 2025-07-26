'use client';

import { useState } from 'react';
import type React from 'react';
import styles from './addReviewPopup.module.css';
import Icon from '@/components/ui/icon/icon';

type AddReviewPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  contentId: number;
  contentTitle: string;
  contentPoster?: string;
  onSubmit: (
    reviewData: {
      contentId: number;
      rate: number;
      title: string;
      description: string;
      spoiler: boolean;
    },
    onClose: () => void,
    resetForm: () => void
  ) => void;
};

export default function AddReviewPopup({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentPoster,
  onSubmit,
}: AddReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          contentId,
          rate: rating,
          title: title.trim(),
          description: description.trim(),
          spoiler,
        },
        onClose,
        resetForm
      );

      setShowSuccess(true);
      setTimeout(() => {
        resetForm();
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setDescription('');
    setSpoiler(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const getRatingLabel = (rating: number) => {
    if (rating <= 2) return 'Terrible';
    if (rating <= 4) return 'Poor';
    if (rating <= 6) return 'Average';
    if (rating <= 8) return 'Good';
    return 'Excellent';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        {/* Success Message */}
        {showSuccess && (
          <div className={styles.successMessage}>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <Icon name='trust-badge' className={styles.checkIcon} />
              </div>
              <div className={styles.successText}>
                <h3 className={styles.successTitle}>
                  Review Submitted Successfully!
                </h3>
                <p className={styles.successSubtitle}>
                  Thank you for sharing your thoughts.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className={styles.backButton}
            >
              <Icon name='close' className={styles.backIcon} />
              Back
            </button>
            <h1 className={styles.title}>Write a Review for {contentTitle}</h1>
            <p className={styles.subtitle}>
              Share your thoughts about this content
            </p>
          </div>

          {/* Main Content */}
          <div className={styles.content}>
            {/* Form Section */}
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Rating Section */}
                <div className={styles.section}>
                  <div className={styles.ratingHeader}>
                    <h3 className={styles.sectionTitle}>Your Rating</h3>
                    <div className={styles.ratingDisplay}>
                      <span className={styles.ratingValue}>
                        {hoverRating || rating}/10
                      </span>
                      <span className={styles.ratingLabel}>
                        {getRatingLabel(hoverRating || rating)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.ratingContainer}>
                    <div className={styles.starsWrapper}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <button
                          key={i}
                          type='button'
                          onClick={() => setRating(i + 1)}
                          onMouseEnter={() => setHoverRating(i + 1)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={styles.starButton}
                        >
                          <Icon
                            name='star'
                            strokeColor='white'
                            className={`${styles.star} ${
                              (hoverRating || rating) > i
                                ? styles.starActive
                                : styles.starInactive
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title Section */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Review Title</h3>
                  <input
                    type='text'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder='Give your review a catchy title...'
                    className={styles.input}
                    maxLength={100}
                  />
                  <div className={styles.charCount}>
                    {title.length}/100 characters
                  </div>
                </div>

                {/* Description Section */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Your Review</h3>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='Share your detailed thoughts, what you liked, what could be better...'
                    className={styles.textarea}
                    maxLength={2000}
                  />
                  <div className={styles.charCount}>
                    {description.length}/2000 characters
                  </div>
                </div>

                {/* Spoiler Section */}
                <div className={styles.spoilerSection}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type='checkbox'
                      checked={spoiler}
                      onChange={e => setSpoiler(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <div className={styles.checkboxCustom}>
                      {spoiler && <div className={styles.checkboxCheck}></div>}
                    </div>
                    <Icon name='alertTriangle' className={styles.warningIcon} />
                    <span className={styles.checkboxText}>
                      This review contains spoilers
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={
                    !title.trim() ||
                    !description.trim() ||
                    rating === 0 ||
                    isSubmitting
                  }
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <div className={styles.loadingContent}>
                      <Icon name='loader' className={styles.spinner} />
                      Submitting Review...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            </div>

            {/* Preview Section */}
            <div className={styles.previewSection}>
              <div className={styles.previewCard}>
                <h3 className={styles.previewTitle}>Review Preview</h3>

                {/* Movie Poster */}
                <div className={styles.posterContainer}>
                  <img
                    src={
                      contentPoster ||
                      '/placeholder.svg?height=300&width=200&query=movie poster'
                    }
                    alt={contentTitle}
                    className={styles.poster}
                  />
                  <div className={styles.posterOverlay}></div>
                  <div className={styles.posterContent}>
                    <h4 className={styles.posterTitle}>{contentTitle}</h4>
                  </div>
                </div>

                {/* Preview Details */}
                <div className={styles.previewDetails}>
                  <div className={styles.detailItem}>
                    <Icon name='film' className={styles.detailIcon} />
                    <span className={styles.detailText}>{contentTitle}</span>
                  </div>

                  {rating > 0 && (
                    <div className={styles.detailItem}>
                      <Icon name='star' className={styles.ratingIcon} />
                      <span className={styles.ratingText}>{rating}/10</span>
                      <span className={styles.ratingBadge}>
                        {getRatingLabel(rating)}
                      </span>
                    </div>
                  )}

                  {title && (
                    <div className={styles.previewContent}>
                      <h5 className={styles.previewContentTitle}>"{title}"</h5>
                    </div>
                  )}

                  {description && (
                    <div className={styles.previewContent}>
                      <p className={styles.previewDescription}>{description}</p>
                    </div>
                  )}

                  {spoiler && (
                    <div className={styles.spoilerBadge}>
                      <Icon
                        name='alertTriangle'
                        className={styles.spoilerIcon}
                      />
                      <span>Contains Spoilers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
