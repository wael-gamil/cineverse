import { MovieDetails, Trailer } from '@/app/constants/types/movie';
import { getMovieDetails, getContentTrailer } from '@/app/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Button from '@/app/components/ui/button/button';
import { Icon } from '@/app/components/ui/icon/icon';
import VideoPlayer from '@/app/components/ui/videoPlayer/videoPlayer';

export default async function Page({ params }: { params: { slug: string } }) {
  // const movieDetails: MovieDetails = await getMovieDetails(params.slug);
  // const trailer: Trailer = await getContentTrailer(movieDetails.id);
  const movieDetails: MovieDetails = {
    id: 1,
    title: 'Inception',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    overview:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    releaseDate: '2010-07-16',
    runtime: 148,
    imdbRating: 8.8,
    language: 'English',
    productionCountry: 'USA',
    platformRating: 92,
  };

  const trailer: Trailer = {
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  };
  
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <div className={styles.layout}>
          {/* Poster + Actions */}
          <div className={styles.posterColumn}>
            <div className={styles.posterCard}>
              <Image
                src={movieDetails.posterUrl}
                alt={movieDetails.title}
                fill
                className={styles.posterImage}
                priority
              />
            </div>

            <div className={styles.actionsGroup}>
              <Button
                variant='solid'
                color='primary'
                ariaLabel='Add to Watchlist'
                width='100%'
              >
                <Icon name='plus' whiteStroke />
                Add to Watchlist
              </Button>
              <Button
                variant='outline'
                color='neutral'
                ariaLabel='Watch Trailer'
                width='100%'
                align='center'
              >
                <Icon name='play' whiteStroke />
                Watch Trailer
              </Button>
            </div>
          </div>

          {/* Info + Trailer */}
          <div className={styles.detailsColumn}>
            {/* Trailer */}

            <VideoPlayer
              url={trailer.trailerUrl}
              title={`${movieDetails.title} - Official Trailer`}
            />

            {/* Movie Info */}
            <div className={styles.infoWrapper}>
              <h1 className={styles.title}>
                {movieDetails.title}
                <span className={styles.year}>
                  ({movieDetails.releaseDate.slice(0, 4)})
                </span>
              </h1>

              <div className={styles.meta}>
                <span>{movieDetails.runtime} min</span>
                <span className={styles.metaDot}></span>
                <span>{movieDetails.releaseDate}</span>
                <span className={styles.metaDot}></span>
                <span>{movieDetails.language}</span>
              </div>

              <div className={styles.ratings}>
                <div className={styles.ratingItem}>
                  <Icon name='star' secondaryStroke />
                  <div className={styles.ratingInfo}>
                    <p className={styles.ratingScore}>
                      {movieDetails.imdbRating}
                      <span className={styles.ratingOutOf}>/10</span>
                    </p>
                    <p className={styles.ratingLabel}>IMDb Rating</p>
                  </div>
                </div>
                <div className={styles.ratingItem}>
                  <span className={styles.ratingIcon}>🍿</span>
                  <div className={styles.ratingInfo}>
                    <p className={styles.ratingScore}>
                      {movieDetails.platformRating}
                      <span className={styles.ratingOutOf}>%</span>
                    </p>
                    <p className={styles.ratingLabel}>Platform Rating</p>
                  </div>
                </div>
              </div>

              <div className={styles.genres}>
                {movieDetails.genres.map(genre => (
                  <span key={genre} className={styles.genreTag}>
                    {genre}
                  </span>
                ))}
              </div>

              <p className={styles.description}>{movieDetails.overview}</p>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.heroDivider}></div>
    </main>
  );
}
