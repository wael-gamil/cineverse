import styles from './skeletonExtendedReviewCard.module.css';

type SkeletonExtendedReviewCardProps = {
  showUserInfo?: boolean;
  showContentInfo?: boolean;
  className?: string;
};

export default function SkeletonExtendedReviewCard({
  showUserInfo = true,
  showContentInfo = true,
  className = '',
}: SkeletonExtendedReviewCardProps) {
  return (
    <article className={`${styles.reviewCard} ${className}`}>
      <div className={styles.cardContent}>
        {/* Poster Image Skeleton - Only show when showContentInfo is true */}
        {showContentInfo && (
          <div className={styles.imageSection}>
            <div className={`${styles.posterImage} ${styles.skeleton}`} />
          </div>
        )}

        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Content Info - Only show when showContentInfo is true */}
          {showContentInfo && (
            <div className={styles.contentInfo}>
              <div className={`${styles.contentTitle} ${styles.skeleton}`} />
              <div className={`${styles.contentType} ${styles.skeleton}`} />
            </div>
          )}

          {/* Rating and Stars */}
          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`${styles.star} ${styles.skeleton}`} />
              ))}
            </div>
          </div>

          {/* Review Meta */}
          <div className={styles.reviewMeta}>
            {/* Author Section - Only show when showUserInfo is true */}
            {showUserInfo && (
              <div className={styles.authorSection}>
                <div className={`${styles.authorText} ${styles.skeleton}`} />
                <div className={styles.authorInfo}>
                  <div className={`${styles.avatar} ${styles.skeleton}`} />
                  <div className={`${styles.username} ${styles.skeleton}`} />
                </div>
              </div>
            )}

            {/* Review Title */}
            <div className={`${styles.reviewTitle} ${styles.skeleton}`} />
          </div>

          {/* Review Description */}
          <div className={styles.reviewDescriptionContainer}>
            <div
              className={`${styles.reviewDescription1} ${styles.skeleton}`}
            />
            <div
              className={`${styles.reviewDescription2} ${styles.skeleton}`}
            />
            <div
              className={`${styles.reviewDescription3} ${styles.skeleton}`}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={styles.reactions}>
              <div className={`${styles.reactionButton} ${styles.skeleton}`} />
              <div className={`${styles.reactionButton} ${styles.skeleton}`} />
            </div>
            <div className={`${styles.date} ${styles.skeleton}`} />
          </div>
        </div>
      </div>
    </article>
  );
}
