import { getMovies } from '@/app/lib/api';
import { Movie } from '@/app/constants/types/movie';
import ContentCard from '@/app/components/cards/contentCard';
import styles from './movieList.module.css';
type MoviesListProps = {
  filters: {
    genres: string[];
    year: string;
    rate: string;
    lang: string;
    sortBy?: string;
  };
};

export default async function MoviesList({ filters }: MoviesListProps) {
  const movies: Movie[] = await getMovies(filters);

  if (!movies || movies.length === 0) {
    return <div className={styles.moviesList}>No movies found.</div>;
  }
  return (
    <div className={styles.moviesList}>
      {movies.map(movie => (
        <ContentCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
