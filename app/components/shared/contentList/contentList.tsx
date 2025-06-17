// components/shared/ContentList.tsx

import ContentCard from '@/app/components/cards/contentCard';
import Pagination from '@/app/components/ui/pagination/pagination';
import styles from './contentList.module.css';
import { Content } from '@/app/constants/types/movie';

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
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
