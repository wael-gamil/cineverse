'use client';

import { useTopReviewersQuery } from '@/hooks/useTopReviewersQuery';
import { useTopReviewedContentQuery } from '@/hooks/useTopReviewedContentQuery';
import styles from './topReviewersSidebar.module.css';

export default function TopReviewersSidebar() {
  const { data: topReviewers = [], isLoading: loadingReviewers } =
    useTopReviewersQuery(5);
  const { data: trendingReviews = [], isLoading: loadingTrending } =
    useTopReviewedContentQuery();

  return (
    <div className={styles.sidebar}>
      {/* Most Liked This Week */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Most Liked This Week</h3>
        <div className={styles.sectionContent}>
          {loadingTrending ? (
            <span className={styles.loadingText}>Loading...</span>
          ) : trendingReviews.length > 0 ? (
            trendingReviews.slice(0, 5).map((review, idx) => (
              <div
                key={review.contentId || idx}
                className={styles.trendingItem}
              >
                <div className={styles.reviewCount}>
                  <span className={styles.countNumber}>
                    {review.reviewCount}
                  </span>
                </div>
                <div className={styles.trendingContent}>
                  <h4 className={styles.trendingTitle}>{review.title}</h4>
                  <div className={styles.trendingMeta}>
                    <span className={styles.contentType}>
                      {review.contentType}
                    </span>
                    <span>•</span>
                    <div className={styles.stars}>
                      {Array.from({
                        length: Math.floor(review.averageRate),
                      }).map((_, i) => (
                        <span key={i} className={styles.star}>
                          ★
                        </span>
                      ))}
                      {review.averageRate % 1 !== 0 && (
                        <span className={styles.star}>½</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className={styles.emptyText}>No trending reviews.</span>
          )}
        </div>
      </div>

      {/* Top Reviewers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Top Reviewers</h3>
        <div className={styles.sectionContent}>
          {loadingReviewers ? (
            <span className={styles.loadingText}>Loading...</span>
          ) : topReviewers.length > 0 ? (
            topReviewers.map((reviewer, idx) => (
              <div
                key={reviewer.user.userId || idx}
                className={styles.reviewerItem}
              >
                <div className={styles.reviewerAvatar}>
                  <img
                    src={reviewer.user.imageUrl || '/placeholder.svg'}
                    alt={reviewer.user.name}
                    className={styles.avatarImage}
                  />
                </div>
                <div className={styles.reviewerInfo}>
                  <h4 className={styles.reviewerName}>
                    {reviewer.user.name || reviewer.user.username}
                  </h4>
                  <div className={styles.reviewerStats}>
                    <span className={styles.reviewCount}>
                      {reviewer.reviewCount} reviews
                    </span>
                    <div className={styles.rating}>
                      <span className={styles.star}>★</span>
                      <span>{reviewer.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className={styles.emptyText}>No reviewers found.</span>
          )}
        </div>
      </div>
    </div>
  );
}
