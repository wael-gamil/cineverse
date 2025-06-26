// components/shared/ContentList.tsx
import Card from '../../cards/card/card';
import Pagination from '@/components/ui/pagination/pagination';
import styles from './contentList.module.css';
import { Content } from '@/constants/types/movie';
import Badge from '../../ui/badge/badge';
import { Icon } from '../../ui/icon/icon';

type Filters = {
  genres: string[];
  year: string;
  rate: string;
  lang: string;
  sortBy?: string;
};

type Props = {
  filters: Filters;
  page: number;
  fetchData: (
    filters: Filters,
    page: number
  ) => Promise<{
    content: Content[];
    totalPages: number;
    currentPage: number;
  }>;
};

export default async function ContentList({ filters, page, fetchData }: Props) {
  const { content, totalPages, currentPage } = await fetchData(filters, page);

  if (!content || content.length === 0) {
    return <div className={styles.contentList}>No content found.</div>;
  }
  return (
    <>
      <div className={styles.contentList}>
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
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
