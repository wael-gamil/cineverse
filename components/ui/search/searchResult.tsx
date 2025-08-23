'use client';
import styles from './searchResult.module.css';
import {  Content } from '@/constants/types/movie';
import Card from '../../cards/card/card';
import Button from '../button/button';
import Pagination from '../pagination/pagination';
import { Icon } from '../icon/icon';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '../badge/badge';
import GridContainer from '@/components/shared/gridContainer/gridContainer';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import ExpandedCard from '@/components/cards/expandedCard/expandedCard';

type Props = {
  contents: Content[];
  query: string;
  currentPage: number;
  totalPages: number;
  type: '' | 'MOVIE' | 'SERIES';
};
export default function SearchResult({
  contents,
  query,
  currentPage,
  totalPages,
  type,
}: Props) {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const isMobile = useResponsiveLayout();
  const [expandedCard, setExpandedCard] = useState<{
    isOpen: boolean;
    content: Content | null;
    cardPosition: DOMRect | null;
  }>({
    isOpen: false,
    content: null,
    cardPosition: null,
  });
  const handleCardClick = (item: Content, href: string) => {
    setActiveId(item.id);
    setTimeout(() => {
      router.push(href);
    }, 400);
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
  return (
    <>
      <div ref={resultRef} className={styles.results}>
        {contents.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.iconContainer}>
              <div className={styles.iconCircle}>
                <Icon
                  name='search'
                  strokeColor='primary'
                  width={40}
                  height={40}
                />
              </div>
              <div className={styles.questionBadge}>
                <span>?</span>
              </div>
            </div>
            {query === '' ? (
              <>
                <h3 className={styles.title}>Start your search</h3>
                <p className={styles.subtitle}>
                  Enter a {type !== 'SERIES' && 'Movie'}
                  {type === '' ? ' , ' : ''}
                  {type !== 'MOVIE' && 'TV show'} name to see results.
                </p>
              </>
            ) : (
              <>
                <h3 className={styles.title}>No results found</h3>
                <p className={styles.subtitle}>
                  We couldn't find any movies or TV shows matching "{query}".
                  Try searching with different keywords or check your spelling.
                </p>
                <div className={styles.actions}>
                  <Button onClick={() => router.push(`/search`)}>
                    Clear Search
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <GridContainer
              layout='grid'
              cardGap={26}
              cardMinWidth={250}
              cardMaxWidth={500}
              cardCount={contents.length}
              scrollRows={isMobile ? 1 : undefined}
            >
              {contents.map(item => (
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
                  imageHeight='image-lg'
                  description={item.overview}
                  href={`/${item.slug}`}
                  onClick={() => handleCardClick(item, `/${item.slug}`)}
                  additionalButton={{
                    iconName: 'info',
                    onClick: e => handleInfoClick(e, item),
                  }}
                  layout='overlay'
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages > 30 ? 30 : totalPages}
            />
          </>
        )}
      </div>
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
