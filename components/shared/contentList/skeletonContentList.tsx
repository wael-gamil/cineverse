'use client';

import SkeletonCard from '@/components/cards/card/skeletonCard';
import styles from './contentList.module.css';

export default function SkeletonContentList() {
  return (
    <div className={styles.contentList}>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonCard
          key={index}
          imageHeight='image-lg'
          layout='overlay'
          maxWidth={300}
          minWidth={250}
        />
      ))}
    </div>
  );
}
