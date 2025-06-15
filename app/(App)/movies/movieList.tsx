import { getMovies } from '@/app/lib/api';
import { Movie } from '@/app/constants/types/movie';
import ContentCard from '@/app/components/cards/contentCard';
import styles from './movieList.module.css';
import Pagination from '@/app/components/ui/pagination/pagination';
type MoviesListProps = {
  filters: {
    genres: string[];
    year: string;
    rate: string;
    lang: string;
    sortBy?: string;
  };
  page: number;
};

export default async function MoviesList({ filters, page }: MoviesListProps) {
  const { content, totalPages, currentPage } = await getMovies(filters, page);

  if (!content || content.length === 0) {
    return <div className={styles.moviesList}>No movies found.</div>;
  }
  return (
    <>
      <div className={styles.moviesList}>
        {content.map(content => (
          <ContentCard key={content.id} movie={content} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
