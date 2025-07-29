import styles from './skeletonTopReviewers.module.css';

export default function SkeletonTopReviewers() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.reviewerItem}>
          <div className={`${styles.avatar} ${styles.skeleton}`}></div>
          <div className={styles.reviewerInfo}>
            <div className={`${styles.name} ${styles.skeleton}`}></div>
            <div className={styles.stats}>
              <div className={`${styles.count} ${styles.skeleton}`}></div>
              <div className={`${styles.stars} ${styles.skeleton}`}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
