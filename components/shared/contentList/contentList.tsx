'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../cards/card/card';
import Pagination from '@/components/ui/pagination/pagination';
import ExpandedCard from '../../cards/expandedCard/expandedCard';
import styles from './contentList.module.css';
import { Content } from '@/constants/types/movie';
import Badge from '../../ui/badge/badge';
import { Icon } from '../../ui/icon/icon';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import EmptyCard from '@/components/cards/card/emptyCard';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type Props = {
  content: Content[];
  totalPages: number;
  currentPage: number;
};

export default function ContentList({
  content,
  totalPages,
  currentPage,
}: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<{
    isOpen: boolean;
    content: Content | null;
    cardPosition: DOMRect | null;
  }>({
    isOpen: false,
    content: null,
    cardPosition: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useResponsiveLayout();

  const handleCardClick = (item: Content, href: string) => {
    setActiveId(item.id);
    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  const handleInfoClick = (e: React.MouseEvent | undefined, item: Content) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get the card element position
      const target = e.currentTarget as HTMLElement;
      const cardElement =
        target.closest('.card') || target.closest('[class*="cardWrapper"]');
      if (cardElement) {
        const cardRect = cardElement.getBoundingClientRect();
        setExpandedCard({
          isOpen: true,
          content: item,
          cardPosition: cardRect,
        });
      }
    }
  };

  const closeExpandedCard = () => {
    setExpandedCard({
      isOpen: false,
      content: null,
      cardPosition: null,
    });
  };

  if (!content || content.length === 0) {
    return <EmptyCard maxWidth={500} minWidth={250} />;
  }

  return (
    <>
      <div ref={containerRef}>
        <GridContainer
          layout='grid'
          cardGap={26}
          cardMinWidth={250}
          cardMaxWidth={500}
          cardCount={content.length}
          scrollRows={isMobile ? 1 : undefined}
        >
          {content.map(item => (
            <Card
              title={item.title}
              key={item.id}
              subtitle={
                item.releaseDate
                  ? `${item.releaseDate.split('-')[0]} • ${item.genres[0]}`
                  : ''
              }
              badges={[
                {
                  iconName: 'star',
                  color: 'secondary',
                  number: Number(item.imdbRate.toFixed(1)),
                  position: 'top-left',
                },
              ]}
              imageUrl={item.posterUrl || '/images/placeholder.jpg'}
              description={item.overview}
              href={`/${item.slug}`}
              layout='overlay'
              onClick={() => handleCardClick(item, `/${item.slug}`)}
              additionalButton={{
                iconName: 'info',
                onClick: e => handleInfoClick(e, item),
              }}
              className={
                activeId === null
                  ? ''
                  : item.id === activeId
                  ? styles.activeCard
                  : styles.inactiveCard
              }
              minWidth={250}
              maxWidth={500}
            >
              <div className={styles.contentDetails}>
                <div className={styles.date}>
                  <Icon name='calendar' strokeColor='muted' width={16} />
                  <span>{item.releaseDate?.split('-')[0]}</span>
                </div>
                <div className={styles.genres}>
                  {item.genres.slice(0, 3).map(genre => (
                    <Badge
                      key={genre}
                      text={genre}
                      color='color-white'
                      backgroundColor='bg-muted'
                      className={styles.genreBadge}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </GridContainer>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* In-Place Expanded Card */}
      {expandedCard.isOpen &&
        expandedCard.content &&
        expandedCard.cardPosition && (
          <ExpandedCard
            content={expandedCard.content}
            isOpen={expandedCard.isOpen}
            onClose={closeExpandedCard}
            cardPosition={expandedCard.cardPosition}
          />
        )}
    </>
  );
}
