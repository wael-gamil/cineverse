import styles from './contentCard.module.css';
import skeletonStyles from './contentCardSkeleton.module.css';

export default function ContentCardSkeleton() {
  return (
    <div className={`${styles.contentCard} ${skeletonStyles.skeletonCard}`}>
      <div
        className={`${styles.posterWrapper} ${skeletonStyles.skeletonPosterWrapper}`}
      >
        <div className={skeletonStyles.poster}></div>
        <div className={skeletonStyles.ratingBadge}></div>
      </div>

      <div className={styles.contentInfo}>
        <div className={styles.contentDetails}>
          <div className={skeletonStyles.title}></div>
          <div className={skeletonStyles.meta}></div>
        </div>
        <div className={skeletonStyles.button}></div>
      </div>
    </div>
  );
}
