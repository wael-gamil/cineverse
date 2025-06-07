// videoPlayerSkeleton.tsx (Client Component)
'use client';

import styles from './videoPlayerSkeleton.module.css';

type VideoPlayerSkeletonProps = {
  posterUrl?: string;
};

export default function VideoPlayerSkeleton({
  posterUrl,
}: VideoPlayerSkeletonProps) {
  return (
    <div className={styles.skeletonContainer}>
      {posterUrl ? (
        <img src={posterUrl} alt='Loading poster' className={styles.poster} />
      ) : (
        <div className={styles.posterPlaceholder} />
      )}
      <div className={styles.overlay}>
        <div className={styles.playButtonPlaceholder} />
      </div>
      <div className={styles.shimmer} />
    </div>
  );
}
