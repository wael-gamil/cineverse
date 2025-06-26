import styles from './skeletonCard.module.css';
import cardStyles from './card.module.css';

export default function SkeletonCard() {
  return (
    <div className={cardStyles.cardWrapper}>
      <div
        className={`${cardStyles.imageWrapper} ${cardStyles['image-md']} ${styles.skeleton}`}
      />
      <div className={cardStyles.belowDetails}>
        <div className={`${styles.skeleton} ${styles.title}`} />
        <div className={`${styles.skeleton} ${styles.description}`} />
      </div>
    </div>
  );
}
