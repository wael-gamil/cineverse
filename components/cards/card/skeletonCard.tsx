import styles from './skeletonCard.module.css';
import cardStyles from './card.module.css';

type SkeletonCardProps = {
  layout?: 'overlay' | 'below' | 'wide';
  imageHeight?: 'image-md' | 'image-lg';
  minWidth?: number;
  maxWidth?: number;
};

export default function SkeletonCard({
  layout = 'overlay',
  imageHeight = 'image-md',
  minWidth = 250,
  maxWidth = 250,
}: SkeletonCardProps) {
  const computedStyle = {
    minWidth: typeof minWidth === 'number' ? `${minWidth}px` : undefined,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : undefined,
  };
  if (layout === 'wide') {
    return (
      <div
        className={`${cardStyles.cardWrapper} ${cardStyles.wideLayout}`}
        style={computedStyle}
      >
        <div className={`${cardStyles.wideImage} ${styles.skeleton}`} />
        <div className={cardStyles.wideDetails}>
          <div className={`${styles.skeleton} ${styles.title}`} />
          <div className={`${styles.skeleton} ${styles.subtitle}`} />
          <div className={`${styles.skeleton} ${styles.description}`} />
        </div>
      </div>
    );
  }

  if (layout === 'below') {
    return (
      <div className={cardStyles.cardWrapper} style={computedStyle}>
        <div
          className={`${cardStyles.imageWrapper} ${cardStyles[imageHeight]} ${styles.skeleton}`}
        />
        <div className={cardStyles.belowDetails}>
          <div className={`${styles.skeleton} ${styles.title}`} />
          <div className={`${styles.skeleton} ${styles.description}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={cardStyles.cardWrapper} style={computedStyle}>
      <div
        className={`${cardStyles.imageWrapper} ${cardStyles[imageHeight]} ${styles.skeleton}`}
      >
        <div className={`${styles.badgePlaceholder}`} />
      </div>

      <div className={cardStyles.gradientOverlay} />
      <div className={cardStyles.bottomTitle}>
        <div className={`${styles.skeleton} ${styles.title}`} />
        <div className={`${styles.skeleton} ${styles.subtitle}`} />
      </div>

      <div className={cardStyles.hoverOverlay}>
        <div className={cardStyles.infoButtonWrapper}>
          <div className={`${styles.iconButtonSkeleton}`} />
        </div>
        <div className={cardStyles.contentDetails}>
          <div className={`${styles.skeleton} ${styles.title}`} />
          <div className={`${styles.skeleton} ${styles.description}`} />
        </div>
      </div>
    </div>
  );
}
