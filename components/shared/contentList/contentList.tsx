'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../cards/card/card';
import Pagination from '@/components/ui/pagination/pagination';
import styles from './contentList.module.css';
import { Content } from '@/constants/types/movie';
import Badge from '../../ui/badge/badge';
import { Icon } from '../../ui/icon/icon';
import CardContainer from '@/components/cards/card/cardContainer';
import EmptyCard from '@/components/cards/card/emptyCard';

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
  const [fullscreenCard, setFullscreenCard] = useState<Content | null>(null);
  const router = useRouter();

  const handleCardClick = (item: Content, href: string) => {
    setActiveId(item.id);
    setFullscreenCard(item);
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  if (!content || content.length === 0) {
    return <EmptyCard />;
  }

  return (
    <>
      <CardContainer
        layout='grid'
        cardMinWidth={250}
        cardCount={content.length}
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
            className={
              activeId === null
                ? ''
                : item.id === activeId
                ? styles.activeCard
                : styles.inactiveCard
            }
            minWidth={250}
            maxWidth={300}
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
      </CardContainer>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
