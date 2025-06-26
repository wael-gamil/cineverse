import styles from './skeletonReviewCard.module.css';

export default function SkeletonReviewCard() {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardTop}>
        <div className={`${styles.avatar} ${styles.skeleton}`} />
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <div className={`${styles.name} ${styles.skeleton}`} />
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`${styles.star} ${styles.skeleton}`} />
              ))}
            </div>
          </div>
          <div className={`${styles.reviewTitle} ${styles.skeleton}`} />
          <div className={`${styles.reviewContent} ${styles.skeleton}`} />
          <div className={styles.reviewFooter}>
            <div className={`${styles.helpful} ${styles.skeleton}`} />
            <div className={`${styles.helpful} ${styles.skeleton}`} />
            <div className={`${styles.date} ${styles.skeleton}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
