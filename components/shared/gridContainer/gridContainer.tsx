'use client';

import { ReactNode, useEffect, useRef } from 'react';
import styles from './gridContainer.module.css';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type LayoutMode = 'grid' | 'scroll';

type GridContainerProps = {
  children: ReactNode;
  layout?: LayoutMode;
  cardGap?: number;
  setCardsPerView?: (count: number) => void;
  cardMinWidth?: number;
  cardMaxWidth?: number;
  cardCount?: number;
  lastPage?: boolean;
  scrollRows?: number;
};

export default function GridContainer({
  children,
  layout = 'scroll',
  cardGap = 16,
  setCardsPerView,
  cardMinWidth = 270,
  cardMaxWidth = 300,
  cardCount,
  lastPage = false,
  scrollRows,
}: GridContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useResponsiveLayout();
  const modifiedCardMinWidth =
    isMobile && !scrollRows ? Math.min(cardMinWidth, 200) : cardMinWidth;
  useEffect(() => {
    if (!setCardsPerView) return;

    const observer = new ResizeObserver(entries => {
      const container = entries[0].target as HTMLDivElement;
      const cardWidth = modifiedCardMinWidth + cardGap;
      const count = Math.floor(container.offsetWidth / cardWidth);
      setCardsPerView(count);
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [modifiedCardMinWidth, cardGap, setCardsPerView]);

  const isSingleCard = layout === 'scroll' && cardCount === 1;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        layout === 'grid' ? styles.grid : styles.gridScroll
      } ${isSingleCard ? styles.centerSingle : ''}`}
      style={{
        gap: `${cardGap}px`,
        ...(layout === 'grid'
          ? {
              gridTemplateColumns:
                cardCount && cardCount <= 6
                  ? `repeat(${cardCount}, ${modifiedCardMinWidth}px)`
                  : `repeat(auto-fit, minmax(${modifiedCardMinWidth}px, 1fr))`,
              ...(scrollRows
                ? {
                    gridAutoFlow: 'column',
                    gridAutoColumns: `minmax(${cardMinWidth}px, 1fr)`,
                    gridTemplateRows: 'repeat(${scrollRows}, auto)',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollBehavior: 'smooth',
                  }
                : {}),
            }
          : {
              gridAutoFlow: 'column',
              gridAutoColumns: lastPage
                ? modifiedCardMinWidth
                : isSingleCard
                ? `minmax(${modifiedCardMinWidth}px, ${cardMaxWidth}px)`
                : `minmax(${modifiedCardMinWidth}px, 1fr)`,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
            }),
      }}
    >
      {children}
    </div>
  );
}
