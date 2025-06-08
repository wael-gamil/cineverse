'use client';
import styles from './contentCard.module.css';
import { Movie } from '@/app/constants/types/movie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '../ui/icon/icon';
import Button from '../ui/button/button';
import useIsMobile from '@/app/hooks/useIsMobile'; // adjust path as needed

type ContentCardProps = {
  movie: Movie;
  displayTypeBadge?: boolean;
  type?: 'movie' | 'tv';
};

export default function ContentCard({
  movie,
  type,
  displayTypeBadge,
}: ContentCardProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div
      className={styles.cardWrapper}
      onClick={() => router.push(`/${movie.slug}`)}
    >
      {/* Poster with overlay */}
      <Image
        src={movie.posterUrl || '/placeholder.svg'}
        alt={movie.title}
        fill
        sizes='(max-width: 768px) 100vw, 400px'
        className={styles.posterImage}
      />
      <div className={styles.gradientOverlay} />
      {movie.imdbRating && (
        <div className={styles.ratingBadge}>
          <Icon name='star' strokeColor='secondary' width={16} />
          <span>{movie.imdbRating.toFixed(1)}</span>
        </div>
      )}
      {displayTypeBadge && (
        <div className={styles.typeBadge}>
          <Icon
            name='film'
            strokeColor={type === 'tv' ? 'secondary' : 'primary'}
            width={16}
          />
          <span>{type === 'tv' ? 'Series' : 'Movie'}</span>
        </div>
      )}
      {/* Show all info always on mobile, else only on hover */}
      {isMobile ? (
        <div className={styles.movieDetailsMobile}>
          <h3 className={styles.movieTitle}>{movie.title}</h3>
          {movie.overview && (
            <p className={styles.movieOverview}>{movie.overview}</p>
          )}

          <div className={styles.metaInfo}>
            <Icon name='calendar' strokeColor='muted' width={16} />
            <span>{movie.releaseDate?.split('-')[0]}</span>
          </div>

          <div className={styles.genres}>
            {movie.genres.slice(0, 3).map(genre => (
              <span key={genre} className={styles.genreBadge}>
                {genre}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.hoverOverlay}>
          <div className={styles.infoButtonWrapper}>
            <Button
              borderRadius='fullRadius'
              variant='outline'
              color='neutral'
              ariaLabel='show more info'
            >
              <Icon name='info' strokeColor='white' />
            </Button>
          </div>

          <div className={styles.movieDetails}>
            <h3 className={styles.movieTitle}>{movie.title}</h3>
            {movie.overview && (
              <p className={styles.movieOverview}>{movie.overview}</p>
            )}

            <div className={styles.metaInfo}>
              <Icon name='calendar' strokeColor='white' width={16} />
              <span>{movie.releaseDate?.split('-')[0]}</span>
            </div>

            <div className={styles.genres}>
              {movie.genres.slice(0, 3).map(genre => (
                <span key={genre} className={styles.genreBadge}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.bottomTitle}>
        <h3>{movie.title}</h3>
        <p>
          {movie.releaseDate?.split('-')[0]} • {movie.genres[0]}
        </p>
      </div>
    </div>
  );
}
