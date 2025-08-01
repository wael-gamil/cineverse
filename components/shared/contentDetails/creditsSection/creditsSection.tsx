'use client';

import { useMemo } from 'react';
import { Credits } from '@/constants/types/movie';
import styles from './creditsSection.module.css';
import Card from '@/components/cards/card/card';
import GridContainer from '@/components/shared/gridContainer/gridContainer';

type CreditsSectionProps = {
  data: Credits;
};

export default function CreditsSection({ data }: CreditsSectionProps) {
  const fullCredits = useMemo(() => {
    const castWithPath = data.casts.filter(actor => actor.imageUrl);

    // Check if director is also in the cast
    const overlappingCast = castWithPath.find(
      actor => data.director && actor.id === data.director.id
    );

    if (data.director) {
      if (overlappingCast) {
        // Merge roles into one card
        const merged = {
          id: data.director.id,
          name: data.director.name,
          imageUrl: data.director.imageUrl,
          characterName: `Director – ${overlappingCast.characterName}`,
        };

        // Remove duplicate from cast
        return [
          merged,
          ...castWithPath.filter(actor => actor.id !== data.director!.id),
        ];
      } else {
        // Director not in cast
        const directorCard = {
          id: data.director.id,
          name: data.director.name,
          imageUrl: data.director.imageUrl,
          characterName: 'Director',
        };
        return [directorCard, ...castWithPath];
      }
    }

    // No director, just cast
    return castWithPath;
  }, [data]);
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Cast & Crew</h2>
      </div>

      <GridContainer
        layout='grid'
        cardMinWidth={270}
        cardCount={fullCredits.length}
        scrollRows={1}
      >
        {fullCredits.map(person => (
          <Card
            key={person.id}
            title={person.name}
            description={person.characterName}
            imageUrl={person.imageUrl}
            imageHeight='image-lg'
            layout='below'
            href={`/crew/${person.id}`}
            minWidth={270}
            maxWidth={400}
          />
        ))}
      </GridContainer>
    </section>
  );
}
