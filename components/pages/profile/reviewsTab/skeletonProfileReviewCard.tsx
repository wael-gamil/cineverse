import styles from './skeletonProfileReviewCard.module.css';

export default function SkeletonProfileReviewCard() {
  return (
    <article className={styles.reviewCard}>
      <div className={styles.cardContent}>
        {/* Poster Image Skeleton */}
        <div className={styles.imageSection}>
          <div className={`${styles.posterImage} ${styles.skeleton}`} />
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Content Info */}
          <div className={styles.contentInfo}>
            <div className={`${styles.contentTitle} ${styles.skeleton}`} />
            <div className={`${styles.contentType} ${styles.skeleton}`} />
          </div>

          {/* Rating and Stars */}
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${styles.star} ${styles.skeleton}`} />
            ))}
          </div>

          {/* Review Title (no author section for profile) */}
          <div className={styles.reviewMeta}>
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
            <div className={styles.editActions}>
              <div className={`${styles.date} ${styles.skeleton}`} />
              <div className={`${styles.editButton} ${styles.skeleton}`} />
              <div className={`${styles.deleteButton} ${styles.skeleton}`} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
