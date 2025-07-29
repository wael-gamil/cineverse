'use client';

import { useTopReviewersQuery } from '@/hooks/useTopReviewersQuery';
import { useTopReviewedContentQuery } from '@/hooks/useTopReviewedContentQuery';
import StarRating from '@/components/ui/starRating/starRating';
import Badge from '@/components/ui/badge/badge';
import SkeletonMostReviewed from './skeletons/skeletonMostReviewed';
import SkeletonTopReviewers from './skeletons/skeletonTopReviewers';
import styles from './topReviewersSidebar.module.css';

export default function TopReviewersSidebar() {
  const { data: topReviewers = [], isLoading: loadingReviewers } =
    useTopReviewersQuery(5);
  const { data: trendingReviews = [], isLoading: loadingTrending } =
    useTopReviewedContentQuery();

  return (
    <div className={styles.sidebar}>
      {/* Most Reviewed */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Most Reviewed</h3>
        <div className={styles.sectionContent}>
          {loadingTrending ? (
            <SkeletonMostReviewed />
          ) : trendingReviews.length > 0 ? (
            trendingReviews.slice(0, 5).map((review, idx) => (
              <div
                key={review.contentId || idx}
                className={styles.trendingItem}
              >
                <Badge
                  number={review.reviewCount}
                  backgroundColor='bg-white'
                  numberColor='color-white'
                  size='size-md'
                  borderRadius='border-md'
                />
                <div className={styles.trendingContent}>
                  <h4 className={styles.trendingTitle}>{review.title}</h4>
                  <div className={styles.trendingMeta}>
                    <span className={styles.contentType}>
                      {review.contentType}
                    </span>
                    <span>•</span>
                    <StarRating
                      rating={review.averageRate}
                      size='sm'
                      className={styles.starsContainer}
                    />
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
            <SkeletonTopReviewers />
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
                    <StarRating
                      rating={reviewer.averageRating}
                      size='sm'
                      className={styles.starsContainer}
                    />
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
