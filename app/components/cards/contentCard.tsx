'use client';
import styles from './contentCard.module.css';
import { Content } from '@/app/constants/types/movie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '../ui/icon/icon';
import Button from '../ui/button/button';
import useIsMobile from '@/app/hooks/useIsMobile'; 

type ContentCardProps = {
  content: Content;
  displayTypeBadge?: boolean;
  type?: 'movie' | 'tv';
};

export default function ContentCard({
  content,
  type,
  displayTypeBadge,
}: ContentCardProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <div
      className={styles.cardWrapper}
      onClick={() => router.push(`/${content.slug}`)}
    >
      {/* Poster with overlay */}
      <Image
        src={content.posterUrl || '/placeholder.svg'}
        alt={content.title}
        fill
        sizes='(max-width: 768px) 100vw, 400px'
        className={styles.posterImage}
      />
      <div className={styles.gradientOverlay} />
      {content.imdbRating && (
        <div className={styles.ratingBadge}>
          <Icon name='star' strokeColor='secondary' width={16} />
          <span>{content.imdbRating.toFixed(1)}</span>
        </div>
      )}
      {displayTypeBadge && (
        <div className={styles.typeBadge}>
          <Icon
            name='film'
            strokeColor={type === 'tv' ? 'secondary' : 'primary'}
            width={16}
          />
          <span>{type === 'tv' ? 'Series' : 'movie'}</span>
        </div>
      )}
      {/* Show all info always on mobile, else only on hover */}
      {isMobile ? (
        <div className={styles.contentDetailsMobile}>
          <h3 className={styles.contentTitle}>{content.title}</h3>
          {content.overview && (
            <p className={styles.contentOverview}>{content.overview}</p>
          )}

          <div className={styles.metaInfo}>
            <Icon name='calendar' strokeColor='muted' width={16} />
            <span>{content.releaseDate?.split('-')[0]}</span>
          </div>

          <div className={styles.genres}>
            {content.genres.slice(0, 3).map(genre => (
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
              variant='ghost'
              color='neutral'
              ariaLabel='show more info'
            >
              <Icon name='info' strokeColor='white' />
            </Button>
          </div>

          <div className={styles.contentDetails}>
            <h3 className={styles.contentTitle}>{content.title}</h3>
            {content.overview && (
              <p className={styles.contentOverview}>{content.overview}</p>
            )}

            <div className={styles.metaInfo}>
              <Icon name='calendar' strokeColor='white' width={16} />
              <span>{content.releaseDate?.split('-')[0]}</span>
            </div>

            <div className={styles.genres}>
              {content.genres.slice(0, 3).map(genre => (
                <span key={genre} className={styles.genreBadge}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.bottomTitle}>
        <h3>{content.title}</h3>
        <p>
          {content.releaseDate?.split('-')[0]} • {content.genres[0]}
        </p>
      </div>
    </div>
  );
}
