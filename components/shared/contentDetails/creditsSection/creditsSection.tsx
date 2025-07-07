import { Credits } from '@/constants/types/movie';
import styles from './creditsSection.module.css';
import Card from '../../../cards/card/card';
import CardContainer from '@/components/cards/card/cardContainer';

type CreditsSectionProps = {
  data: Credits;
};

export default function CreditsSection({ data }: CreditsSectionProps) {
  console.log(data);
  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Cast & Crew</h2>
      </div>

      {/* Cast Grid */}
      <CardContainer layout='grid' cardMinWidth={220}>
        {/* Director Card */}
        {data.director && (
          <Card
            title={data.director.name}
            description='Director'
            imageUrl={data.director.path}
            imageHeight='image-lg'
            layout='below'
            href={`/crew/${data.director.id}`}
            minWidth={220}
            maxWidth={350}
          />
        )}

        {data.casts
          .filter(actor => {
            return actor.path;
          })
          .map((actor, index) => (
            <Card
              key={index}
              title={actor.name}
              description={actor.characterName}
              imageUrl={actor.path}
              imageHeight='image-lg'
              layout='below'
              href={`/crew/${actor.id}`}
              minWidth={220}
              maxWidth={350}
            />
          ))}
      </CardContainer>
    </section>
  );
}
