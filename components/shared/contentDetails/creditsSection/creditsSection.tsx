'use client';

import { useState, useMemo } from 'react';
import { Credits } from '@/constants/types/movie';
import styles from './creditsSection.module.css';
import Card from '@/components/cards/card/card';
import CardContainer from '@/components/cards/card/cardContainer';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';

type CreditsSectionProps = {
  data: Credits;
};

export default function CreditsSection({ data }: CreditsSectionProps) {
  const [cardsPerView, setCardsPerView] = useState(6);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const fullCredits = useMemo(() => {
    const directorCard = data.director
      ? [
          {
            id: data.director.id,
            name: data.director.name,
            path: data.director.path,
            characterName: 'Director',
          },
        ]
      : [];
    return [...directorCard, ...data.casts.filter(actor => actor.path)];
  }, [data]);

  const visibleCredits = useMemo(() => {
    return fullCredits.slice(
      visibleStartIndex,
      visibleStartIndex + cardsPerView
    );
  }, [fullCredits, visibleStartIndex, cardsPerView]);

  const handlePrev = () => {
    setVisibleStartIndex(prev => Math.max(prev - cardsPerView, 0));
  };

  const handleNext = () => {
    const nextStart = visibleStartIndex + cardsPerView;
    if (nextStart < fullCredits.length) {
      setVisibleStartIndex(nextStart);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>Cast & Crew</h2>
      </div>

      <div className={styles.sliderRow}>
        <Button
          onClick={handlePrev}
          variant='outline'
          color='neutral'
          disabled={visibleStartIndex === 0}
        >
          <Icon name='arrow-left' strokeColor='white' />
        </Button>

        <CardContainer
          layout='scroll'
          cardMinWidth={240}
          cardGap={16}
          setCardsPerView={setCardsPerView}
          cardCount={cardsPerView}
        >
          {visibleCredits.map(person => (
            <Card
              key={person.id}
              title={person.name}
              description={person.characterName}
              imageUrl={person.path}
              imageHeight='image-lg'
              layout='below'
              href={`/crew/${person.id}`}
              minWidth={240}
              maxWidth={700}
            />
          ))}
        </CardContainer>

        <Button
          onClick={handleNext}
          variant='outline'
          color='neutral'
          disabled={visibleStartIndex + cardsPerView >= fullCredits.length}
        >
          <Icon name='arrow-right' strokeColor='white' />
        </Button>
      </div>
    </section>
  );
}
