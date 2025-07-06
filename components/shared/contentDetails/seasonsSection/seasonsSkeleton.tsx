import styles from './seasonsSection.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import CardContainer from '@/components/cards/card/cardContainer';

export default function SeasonsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Seasons & Episodes</h2>
      </div>

      <div className={styles.container}>
        {/* Slider Row */}
        <div className={styles.sliderRow}>
          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-left' strokeColor='white' />
          </Button>

          <CardContainer layout='scroll' cardMinWidth={250} cardGap={16}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard
                key={i}
                imageHeight='image-lg'
                layout='overlay'
                maxWidth={300}
                minWidth={250}
              />
            ))}
          </CardContainer>

          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>

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

          <CardContainer layout='grid' cardMinWidth={270} cardGap={16}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard
                key={i}
                imageHeight='image-md'
                layout='below'
                maxWidth={300}
                minWidth={270}
              />
            ))}
          </CardContainer>
        </div>
      </div>
    </section>
  );
}
