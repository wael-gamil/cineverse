'use client';
import styles from './seasonsSection.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

export default function SeasonsSkeleton() {
  const isMobile = useResponsiveLayout();
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>

      <div className={styles.container}>
        {/* Slider Row */}

        <GridContainer layout='grid' cardMinWidth={270} scrollRows={1}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard
              key={i}
              imageHeight='image-lg'
              layout={isMobile ? 'below' : 'overlay'}
              maxWidth={400}
              minWidth={270}
            />
          ))}
        </GridContainer>

        {/* Episodes Section */}
        <div className={styles.episodesSection}>
          <div className={styles.episodesHeader}>
            <div className={styles.episodesHeading}>
              <h3>Episodes</h3>
            </div>
            <Button variant='ghost' color='neutral' disabled>
              <Icon name='chevron-up' strokeColor='white' />
              Hide Episodes
            </Button>
          </div>

          <GridContainer layout='grid' cardMinWidth={270} cardGap={16}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard
                key={i}
                imageHeight='image-md'
                layout='below'
                maxWidth={300}
                minWidth={270}
              />
            ))}
          </GridContainer>
        </div>
      </div>
    </section>
  );
}
