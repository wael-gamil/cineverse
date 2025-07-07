'use client';

import { ReactNode, useEffect, useRef } from 'react';
import styles from './cardContainer.module.css';

type LayoutMode = 'grid' | 'scroll';

type CardContainerProps = {
  children: ReactNode;
  layout?: LayoutMode;
  cardGap?: number;
  setCardsPerView?: (count: number) => void;
  cardMinWidth?: number;
  cardCount?: number;
};

export default function CardContainer({
  children,
  layout = 'scroll',
  cardGap = 16,
  setCardsPerView,
  cardMinWidth = 270,
  cardCount,
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setCardsPerView) return;

    const observer = new ResizeObserver(entries => {
      const container = entries[0].target as HTMLDivElement;
      const cardWidth = cardMinWidth + cardGap;
      const count = Math.floor(container.offsetWidth / cardWidth);
      setCardsPerView(count);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [cardMinWidth, cardGap, setCardsPerView]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        layout === 'grid' ? styles.grid : styles.scroll
      }`}
      style={{
        gap: `${cardGap}px`,
        ...(layout === 'grid'
          ? {
              gridTemplateColumns:
                cardCount && cardCount <= 6
                  ? `repeat(${cardCount}, ${cardMinWidth}px)`
                  : `repeat(auto-fit, minmax(${cardMinWidth}px, 1fr))`,
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
