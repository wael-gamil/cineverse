import ContentCardSkeleton from '@/app/components/cards/contentCardSkeleton';
import styles from './movieList.module.css';
export default function MoviesListSkelton() {
  return (
    <div className={styles.moviesList}>
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className={styles.movieCard}>
          <ContentCardSkeleton />
        </div>
      ))}
    </div>
  );
}
