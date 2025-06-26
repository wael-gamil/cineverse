'use client';

import styles from './seasonsSection.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';

export default function SeasonsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>

      <div className={styles.container}>
        <div className={styles.seasonTabs}>
          <Button variant='outline' color='neutral'>
            <Icon name='arrow-left' strokeColor='white' />
          </Button>

          <div className={styles.seasonCardsWrapper}>
            <div className={styles.seasonCards}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>

          <Button variant='outline' color='neutral'>
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>

        <div className={styles.episodesSection}>
          <div className={styles.episodesHeader}>
            <div className={styles.episodesHeading}>
              <h3>Episodes</h3>
            </div>
            <Button variant='ghost' color='neutral'>
              <Icon name='chevron-up' strokeColor='white' />
              Hide Episodes
            </Button>
          </div>

          <div className={styles.episodesGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
