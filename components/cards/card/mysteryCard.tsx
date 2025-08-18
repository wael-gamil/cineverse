'use client';

import { useState, useEffect } from 'react';
import styles from './mysteryCard.module.css';
import Card from '@/components/cards/card/card';
import { Icon } from '@/components/ui/icon/icon';
import type { Content } from '@/constants/types/movie';
import type { IconName } from '@/components/ui/icon/icon';

type MysteryCardProps = {
  item: Content;
  isRevealed?: boolean;
  onFlip?: () => void;
  onInfoClick?: (e?: React.MouseEvent) => void; // parent handler
};

export default function MysteryCard({
  item,
  isRevealed = false,
  onFlip,
  onInfoClick,
}: MysteryCardProps) {
  const [flipped, setFlipped] = useState(isRevealed);

  // Update local state when prop changes
  useEffect(() => {
    setFlipped(isRevealed);
  }, [isRevealed]);
  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      onFlip?.();
    }
  };

  return (
    <div
      className={`${styles.card} ${flipped ? styles.flipped : ''}`}
      onClick={handleClick}
    >
      <div className={styles.cardInner}>
        {/* FRONT SIDE */}
        <div className={styles.cardFront}>
          <div className={styles.mysteryGlow}>
            <Icon name='sparkles' strokeColor='white' />
            <p className={styles.revealText}>Tap to Reveal</p>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={styles.cardBack}>
          <Card
            key={item.id}
            title={item.title}
            subtitle={item.releaseDate?.split('-')[0]}
            description={item.overview}
            imageUrl={item.posterUrl}
            href={`/${item.slug}`}
            additionalButton={{
              iconName: 'info' as IconName,
              onClick: e => onInfoClick?.(e),
            }}
            layout='overlay'
            imageHeight='image-lg'
            badges={[
              {
                iconName: 'star' as IconName,
                color: 'secondary',
                number: Number(item.imdbRate.toFixed(1)),
                position: 'top-left',
              },
            ]}
            minWidth={250}
            maxWidth={250}
          />
        </div>
      </div>
    </div>
  );
}
