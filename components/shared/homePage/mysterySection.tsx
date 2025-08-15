'use client';

import { useState, useEffect } from 'react';
import styles from './mysterySection.module.css';
import MysteryCard from '@/components/cards/card/mysteryCard';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import { useRandomContentQuery } from '@/hooks/useRandomContentQuery';

export default function MysterySection() {
  const { data, isLoading, error, refetch, isFetching } =
    useRandomContentQuery();

  const [revealedCardId, setRevealedCardId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state and load from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedRevealedCard = localStorage.getItem('mysteryCardRevealed');
    if (savedRevealedCard) {
      try {
        const parsedCard = JSON.parse(savedRevealedCard);
        setRevealedCardId(parsedCard.id);
      } catch (error) {
        localStorage.removeItem('mysteryCardRevealed');
      }
    }
  }, []);

  // Only validate and potentially clear storage when data is actually loaded
  useEffect(() => {
    if (!data || isLoading) return; // Don't do anything if data is not loaded yet

    const savedRevealedCard = localStorage.getItem('mysteryCardRevealed');

    if (savedRevealedCard) {
      try {
        const parsedCard = JSON.parse(savedRevealedCard);
        // Only clear if the content is definitely different (not just loading)
        if (
          data.id !== parsedCard.id ||
          data.title !== parsedCard.title ||
          data.slug !== parsedCard.slug
        ) {
          // This is genuinely different content, clear the storage
          setRevealedCardId(null);
          localStorage.removeItem('mysteryCardRevealed');
        }
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('mysteryCardRevealed');
        setRevealedCardId(null);
      }
    }
  }, [data, isLoading]);

  const handleCardFlip = () => {
    if (data?.id) {
      setRevealedCardId(data.id);
      localStorage.setItem(
        'mysteryCardRevealed',
        JSON.stringify({
          id: data.id,
          title: data.title,
          slug: data.slug,
        })
      );
    }
  };

  const handleDrawAnother = () => {
    setRevealedCardId(null); // Reset revealed state for new draw
    localStorage.removeItem('mysteryCardRevealed');
    refetch();
  };

  const isRevealed = isClient && data?.id ? revealedCardId === data.id : false;

  return (
    <section className={styles.wrapper}>
      <div className={styles.text}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Icon name='dice' strokeColor='white' width={32} height={32} />
            <span>Mystery Pick</span>
          </h2>
          <p className={styles.subtitle}>
            Flip the card to reveal a surprise movie or series.
          </p>
        </div>
        <Button onClick={handleDrawAnother} disabled={isFetching} padding='lg'>
          {isFetching ? 'Drawing...' : 'Draw Another Mystery'}
        </Button>
      </div>

      {isLoading || isFetching ? (
        <p className={styles.status}>Loading mystery...</p>
      ) : error || !data ? (
        <p className={styles.status}>Unable to load mystery card.</p>
      ) : (
        <MysteryCard
          item={data}
          isRevealed={isRevealed}
          onFlip={handleCardFlip}
        />
      )}
    </section>
  );
}
