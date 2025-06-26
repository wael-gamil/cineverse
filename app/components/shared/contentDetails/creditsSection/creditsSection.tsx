import { Credits } from '@/app/constants/types/movie';
import styles from './creditsSection.module.css';
import Card from '../../../cards/card/card';

type CreditsSectionProps = {
  data: Credits;
};

export default function CreditsSection({ data }: CreditsSectionProps) {
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Cast & Crew</h2>
      </div>

      {/* Cast Grid */}
      <div className={styles.creditsGrid}>
        {/* Director Card */}
        {data.director && (
          <Card
            title={data.director.name}
            description='Director'
            imageUrl={data.director.path}
            imageHeight='image-md'
            layout='below'
          />
        )}

        {data.casts.map((actor, index) => (
          <Card
            key={index}
            title={actor.name}
            description={actor.characterName}
            imageUrl={actor.path}
            imageHeight='image-md'
            layout='below'
          />
        ))}
      </div>
    </section>
  );
}
