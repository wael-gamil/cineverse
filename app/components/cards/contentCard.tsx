'use client';
import styles from './contentCard.module.css';
import { Movie } from '@/app/constants/types/movie';
import Button from '../ui/button/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// import { Film, Tv, Star, Calendar, Play } from 'lucide-react';
import { useState } from 'react';

type ContentCardProps = {
  movie: Movie;
  type?: 'movie' | 'tv';
};

export default function ContentCard({ movie, type }: ContentCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={styles.cardWrapper}
      onClick={() => router.push(`/${movie.slug}`)}
    >
      {/* Poster with overlay */}
      <div className={styles.posterContainer}>
        <Image
          src={movie.posterUrl || '/placeholder.svg'}
          alt={movie.title}
          fill
          className={`${styles.posterImage} ${
            imageLoaded ? styles.imageVisible : styles.imageHidden
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <div className={styles.loadingPlaceholder}>
            {/* <Film className={styles.loadingIcon} /> */}
          </div>
        )}

        <div className={styles.gradientOverlay} />

        {movie.imdbRating && (
          <div className={styles.ratingBadge}>
            {/* <Star className={styles.starIcon} /> */}
            <span>{movie.imdbRating.toFixed(1)}</span>
          </div>
        )}

        <div className={styles.typeBadge}>
          {/* {type === 'tv' ? (
            // <Tv className={styles.typeIcon} />
          ) : (
            // <Film className={styles.typeIcon} />
          )} */}
          <span>{type === 'tv' ? 'Series' : 'Movie'}</span>
        </div>

        <div className={styles.hoverOverlay}>
          <div className={styles.overlayContent}>
            <div className={styles.playButtonWrapper}>
              <div className={styles.playButton}>
                {/* <Play className={styles.playIcon} /> */}
              </div>
            </div>

            <div className={styles.movieDetails}>
              <h3 className={styles.movieTitle}>{movie.title}</h3>
              {movie.overview && (
                <p className={styles.movieOverview}>{movie.overview}</p>
              )}

              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  {/* <Calendar className={styles.metaIcon} /> */}
                  <span>{movie.releaseDate?.split('-')[0]}</span>
                </div>
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
        </div>

        <div className={styles.bottomTitle}>
          <h3>{movie.title}</h3>
          <p>
            {movie.releaseDate?.split('-')[0]} • {movie.genres[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
