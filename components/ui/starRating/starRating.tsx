'use client';

import type React from 'react';
import { Icon } from '../icon/icon';
import styles from './starRating.module.css';

interface StarRatingProps {
  rating: number; // Rating out of 10
  size?: 'sm' | 'md' | 'lg';
  showSparkles?: boolean;
  className?: string;
  animated?: boolean;
}

export default function StarRating({
  rating,
  size = 'md',
  showSparkles = false,
  className = '',
  animated = false,
}: StarRatingProps) {
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = (i + 1) * 2; // Each star represents 2 points out of 10
      const halfStarValue = starValue - 1; // Half star threshold

      // Calculate the fill percentage for this star (0 to 1)
      let fillPercentage = 0;
      if (rating >= starValue) {
        fillPercentage = 1; // Fully filled
      } else if (rating >= halfStarValue) {
        // Partially filled - calculate exact percentage
        fillPercentage = (rating - halfStarValue + 1) / 2;
      }

      return (
        <div
          key={i}
          className={`${styles.starContainer} ${styles[size]} ${
            animated ? styles.animated : ''
          }`}
          style={
            {
              '--fill-percentage': `${fillPercentage * 100}%`,
              '--delay': animated ? `${i * 0.1}s` : '0s',
            } as React.CSSProperties
          }
        >
          {/* Background star (empty) */}
          <Icon
            name='starEmpty'
            className={`${styles.star} ${styles.starBackground}`}
          />
          {/* Foreground star (filled) with clip-path */}
          <Icon
            name='starFilled'
            className={`${styles.star} ${styles.starForeground}`}
          />
          {/* Sparkle effect for perfect ratings */}
          {showSparkles && rating === 10 && fillPercentage === 1 && (
            <div className={styles.sparkleEffect}>
              <div className={styles.sparkle}></div>
              <div className={styles.sparkle}></div>
              <div className={styles.sparkle}></div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`${styles.starRating} ${animated ? styles.animated : ''} ${className}`}>
      {renderStars()}
    </div>
  );
}
