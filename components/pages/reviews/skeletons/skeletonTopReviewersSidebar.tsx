import styles from './skeletonTopReviewersSidebar.module.css';

export default function SkeletonTopReviewersSidebar() {
  return (
    <div className={styles.sidebar}>
      {/* Most Reviewed Skeleton */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div className={styles.shimmer}></div>
        </div>
        <div className={styles.sectionContent}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.trendingItem}>
              <div className={styles.badgeSkeleton}>
                <div className={styles.shimmer}></div>
              </div>
              <div className={styles.trendingContent}>
                <div className={styles.trendingTitle}>
                  <div className={styles.shimmer}></div>
                </div>
                <div className={styles.trendingMeta}>
                  <div className={styles.contentTypeSkeleton}>
                    <div className={styles.shimmer}></div>
                  </div>
                  <div className={styles.dividerSkeleton}>•</div>
                  <div className={styles.starsSkeleton}>
                    <div className={styles.shimmer}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Reviewers Skeleton */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <div className={styles.shimmer}></div>
        </div>
        <div className={styles.sectionContent}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.reviewerItem}>
              <div className={styles.reviewerAvatar}>
                <div className={styles.shimmer}></div>
              </div>
              <div className={styles.reviewerInfo}>
                <div className={styles.reviewerName}>
                  <div className={styles.shimmer}></div>
                </div>
                <div className={styles.reviewerStats}>
                  <div className={styles.reviewCountSkeleton}>
                    <div className={styles.shimmer}></div>
                  </div>
                  <div className={styles.starsSkeleton}>
                    <div className={styles.shimmer}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
