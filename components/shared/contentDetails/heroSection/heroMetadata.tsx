// components/hero/HeroMetadata.tsx
'use client';

import styles from './contentHero.module.css';
import { NormalizedContent } from '@/constants/types/movie';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import Image from 'next/image';

type Props = {
  content: NormalizedContent;
  runtime: string;
  fallbackPoster?: string;
  showPoster?: boolean;
  trailerAvailable?: boolean;
  isMuted?: boolean;
  onPlayTrailer?: () => void;
  onToggleMute?: () => void;
  onShare?: () => void;
  genres?: string[];
  className?: string;
};

export default function HeroMetadata({
  content,
  runtime,
  fallbackPoster,
  showPoster = false,
  trailerAvailable = false,
  isMuted = true,
  onPlayTrailer,
  onToggleMute,
  onShare,
  genres,
  className = '',
}: Props) {
  const genreList = content.genres || genres || [];

  return (
    <div className={`${styles.rightSection} ${className}`}>
      {showPoster && (
        <div className={styles.posterWrapper}>
          <Image
            src={content.imageUrl || fallbackPoster || ''}
            alt={content.title}
            fill
            className={styles.posterImage}
          />
        </div>
      )}

      <h1 className={styles.title}>{content.title}</h1>

      <div className={styles.infoRow}>
        {typeof content.imdbRate === 'number' && content.imdbRate > 0 && (
          <Badge
            iconName='starFilled'
            text='IMDB'
            color='color-primary'
            number={Number(content.imdbRate.toFixed(1))}
            iconColor='secondary'
            backgroundColor='bg-muted'
            size='size-lg'
            className={styles.imdbBadge}
          />
        )}

        {content.releaseDate && (
          <Badge
            text={content.releaseDate.split('-')[0]}
            iconName='calendar'
            backgroundColor='bg-muted'
            size='size-lg'
          />
        )}

        {runtime && (
          <Badge
            text={runtime}
            iconName='clock'
            backgroundColor='bg-muted'
            size='size-lg'
            className={styles.runtimeBadge}
          />
        )}

        {content.status && (
          <div
            className={`${styles.status} ${
              content.status === 'Continuing'
                ? styles.statusGreen
                : content.status === 'Ended'
                ? styles.statusRed
                : ''
            }`}
          >
            {content.status}
          </div>
        )}
      </div>
      {genreList && (
        <div className={styles.genreList}>
          {genreList.map(genre => (
            <Badge
              key={genre}
              text={genre}
              iconName='badge'
              color='color-white'
              backgroundColor='bg-white'
              className={styles.genreBadge}
              size='size-lg'
              borderRadius='border-full'
            />
          ))}
        </div>
      )}

      {content.description && (
        <p className={styles.description}>{content.description}</p>
      )}

      <div className={styles.actions}>
        {trailerAvailable && onPlayTrailer && (
          <Button color='primary' onClick={onPlayTrailer}>
            <Icon name='play' strokeColor='white' />
            Play Trailer
          </Button>
        )}
        <Button color='neutral'>
          <Icon name='bookmark' strokeColor='white' />
          Add to Watchlist
        </Button>
        <Button color='neutral' onClick={onShare}>
          <Icon name='share' strokeColor='white' />
        </Button>
        {trailerAvailable && onToggleMute && (
          <Button color='neutral' onClick={onToggleMute}>
            <Icon name={isMuted ? 'mute' : 'speaker'} strokeColor='white' />
          </Button>
        )}
      </div>
    </div>
  );
}
