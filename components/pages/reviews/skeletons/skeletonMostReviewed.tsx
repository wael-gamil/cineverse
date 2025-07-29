import styles from './skeletonMostReviewed.module.css';

export default function SkeletonMostReviewed() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.trendingItem}>
          <div className={`${styles.badge} ${styles.skeleton}`}></div>
          <div className={styles.trendingContent}>
            <div className={`${styles.title} ${styles.skeleton}`}></div>
            <div className={styles.meta}>
              <div className={`${styles.contentType} ${styles.skeleton}`}></div>
              <span className={styles.divider}>•</span>
              <div className={`${styles.stars} ${styles.skeleton}`}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
