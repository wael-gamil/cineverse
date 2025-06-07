'use client';

import { useState } from 'react';
import styles from './videoPlayer.module.css';
import { Icon } from '../icon/icon';

type VideoPlayerParams = {
  url: string;
  title?: string;
};

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function VideoPlayer({
  url,
  title = 'Official Trailer',
}: VideoPlayerParams) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = getYouTubeVideoId(url);
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : '';
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : '';

  const handlePlay = () => {
    if (!videoId) return;
    setIsPlaying(true);
  };

  return (
    <div
      className={`${styles.container} ${isPlaying ? styles.playing : ''}`}
      onClick={!isPlaying ? handlePlay : undefined}
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if ((e.key === ' ' || e.key === 'Enter') && !isPlaying) {
          e.preventDefault();
          handlePlay();
        }
      }}
      aria-label={isPlaying ? 'Playing video' : 'Play video'}
    >
      {!isPlaying && (
        <div
          className={styles.overlay}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
          aria-hidden='true'
        >
          <div className={styles.playButton}>
            <Icon name='play' whiteStroke />
          </div>
          <div className={styles.caption}>
            <h3>{title}</h3>
            <p>Click to play</p>
          </div>
        </div>
      )}

      {isPlaying && videoId && (
        <iframe
          className={styles.video}
          src={embedUrl}
          title={title}
          allow='autoplay; encrypted-media'
          allowFullScreen
        />
      )}
    </div>
  );
}
