import CardContainer from '@/components/cards/card/cardContainer';
import styles from './seasonsSection.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';

export default function EpisodeSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.episodesHeader}>
        <div className={styles.episodesHeading}>
          <h3>Episodes</h3>
        </div>
        <Button variant='ghost' color='neutral'>
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
    </section>
  );
}
