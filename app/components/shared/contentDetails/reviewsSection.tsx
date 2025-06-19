'use client';

import styles from './reviewsSection.module.css';
import { Review } from '@/app/constants/types/movie';
import Image from 'next/image';
import Link from 'next/link';
// import { ThumbsUp, MessageSquare, PlusCircle, Star } from 'lucide-react';
import { Icon } from '../../ui/icon/icon';
import fallbackAvatar from '@/public/avatar_fallback.png';

type ReviewsSectionProps = {
  data: Review[];
};

export default function ReviewsSection({ data }: ReviewsSectionProps) {
  const mostHelpfulReview = data[0];
  const otherReviews = data.slice(1);

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>Reviews</h2>
              <p className={styles.subtext}>{data.length} reviews</p>
            </div>

            <Link href='#' className={styles.addReview}>
              <Icon name='PlusCircle' />
              Add Your Review
            </Link>
          </div>

          {/* Most Helpful Review */}
          {mostHelpfulReview && (
            <div className={styles.section}>
              <h3 className={styles.subtitle}>Most Helpful Review</h3>
              <div className={styles.reviewCard}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>
                    <Image
                      src={mostHelpfulReview.user?.path || fallbackAvatar}
                      alt={mostHelpfulReview.user?.name || 'User'}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <h4>{mostHelpfulReview.user?.name}</h4>
                      <div className={styles.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name={
                              i < Math.floor(mostHelpfulReview.rate || 0)
                                ? 'starFilled'
                                : 'star'
                            }
                            className={
                              i < Math.floor(mostHelpfulReview.rate || 0)
                                ? styles.starFilled
                                : styles.starEmpty
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <h5 className={styles.reviewTitle}>
                      {mostHelpfulReview.title}
                    </h5>
                    <p className={styles.reviewContent}>
                      {mostHelpfulReview.content}
                    </p>
                    <div className={styles.reviewFooter}>
                      <button className={styles.helpfulBtn}>
                        <Icon name='ThumbsUp' />
                        <span>{mostHelpfulReview.likes || 0} helpful</span>
                      </button>
                      <span className={styles.date}>
                        {mostHelpfulReview.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Reviews */}
          {otherReviews.length > 0 && (
            <div>
              <h3 className={styles.subtitle}>
                All Reviews ({otherReviews.length})
              </h3>
              <div className={styles.reviewList}>
                {otherReviews.map((review, index) => (
                  <div key={index} className={styles.reviewCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.avatarSmall}>
                        <Image
                          src={review.user?.path || fallbackAvatar}
                          alt={review.user?.name || 'User'}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.cardHeader}>
                          <h4>{review.user?.name}</h4>
                          <div className={styles.stars}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Icon
                                key={i}
                                name={
                                  i < Math.floor(review.rate || 0)
                                    ? 'starFilled'
                                    : 'star'
                                }
                                className={
                                  i < Math.floor(review.rate || 0)
                                    ? styles.starFilled
                                    : styles.starEmpty
                                }
                              />
                            ))}
                          </div>
                          <span className={styles.date}>{review.date}</span>
                        </div>
                        <p className={styles.reviewContent}>{review.content}</p>
                        <div className={styles.reviewFooter}>
                          <button className={styles.helpfulBtn}>
                            <Icon name='ThumbsUp' />
                            <span>{review.likes || 0}</span>
                          </button>
                          <Link
                            href={`/reviews/${review.id || index}`}
                            className={styles.readMore}
                          >
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.length === 0 && (
            <div className={styles.empty}>
              <Icon name='MessageSquare' />
              <h3 className={styles.subtitle}>No reviews yet</h3>
              <p className={styles.emptyText}>
                Be the first to share your thoughts about this content!
              </p>
              <Link href='#' className={styles.addReview}>
                <Icon name='PlusCircle' />
                Write the First Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
