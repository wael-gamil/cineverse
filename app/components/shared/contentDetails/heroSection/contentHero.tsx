'use client';
import styles from './contentHero.module.css';
import { NormalizedContent } from '@/app/constants/types/movie';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoControls from '../../../ui/videoControls/videoControls';
import Button from '../../../ui/button/button';
import { Icon } from '../../../ui/icon/icon';
import Badge from '../../../ui/badge/badge';

type ContentHeroProps = {
  content: NormalizedContent;
  trailerUrl?: string;
  backgroundUrl?: string;
  genres?: string[];
};

function getYouTubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match && match[1] ? match[1] : '';
}

export default function ContentHero({
  content,
  trailerUrl,
  backgroundUrl = '',
  genres,
}: ContentHeroProps) {
  const [trailerFocusMode, setTrailerFocusMode] = useState(false);
  const videoId = trailerUrl ? getYouTubeVideoId(trailerUrl) : null;
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const genreList = content.genres || genres;
  const runtime: string =
    typeof content.runtime === 'number' && !isNaN(content.runtime)
      ? (() => {
          const totalMinutes = content.runtime;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return hours > 0
            ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
            : `${minutes}m`;
        })()
      : typeof content.runtime === 'string'
      ? content.runtime
      : '';
  // Load YouTube API once
  useEffect(() => {
    if (!videoId || player) return;

    const createPlayer = () => {
      if (!iframeRef.current) return;
      const newPlayer = new (window as any).YT.Player(iframeRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setPlayer(event.target);
          },
        },
      });
    };

    const existingScript = document.getElementById('youtube-api');
    const apiReady = (window as any).YT && (window as any).YT.Player;

    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    } else if (apiReady) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }
  }, [videoId, player]);

  // Handle mute/unmute when entering/exiting focus mode
  useEffect(() => {
    if (!trailerFocusMode && player) {
      if (isMuted) {
        player.mute();
      } else {
        player.unMute();
        player.setVolume(20);
      }
    }
    if (!player || !trailerFocusMode) return;
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (duration - currentTime <= 10) {
        setTrailerFocusMode(false); // Exit trailer focus mode
        player.seekTo(0, true);
        clearInterval(interval); // Stop checking
      }
    }, 1000); // check every second

    return () => clearInterval(interval);
  }, [player, trailerFocusMode]);

  // Toggle mute/unmute
  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(20);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handlePlayTrailer = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setTrailerFocusMode(true);
      setIsFadingOut(false); // reset for next time
    }, 500); // matches your fadeOut animation duration
  };
  return (
    <section className={styles.hero}>
      {/* Background Video */}
      <div
        className={`${styles.background} ${
          trailerFocusMode ? styles.aboveEverything : ''
        }`}
      >
        {/* YouTube Player injected here */}
        {videoId ? (
          <div ref={iframeRef} className={styles.video} />
        ) : (
          <Image
            src={content.backgroundUrl || backgroundUrl}
            alt={content.title}
            fill
            className={styles.backdropImage}
          />
        )}
      </div>

      {/* Overlays */}
      {(!trailerFocusMode || isFadingOut) && (
        <>
          <div className={styles.overlayDark} />
          <div className={styles.overlayGradient} />
          <div className={styles.overlayBlur} />
          <div className={styles.spotlightEffect} />
        </>
      )}

      {/* Content Metadata */}
      {(!trailerFocusMode || isFadingOut) && (
        <div
          className={`${styles.container} ${isFadingOut ? styles.fadeOut : ''}`}
        >
          {!videoId && (
            <div className={styles.posterWrapper}>
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className={styles.posterImage}
              />
            </div>
          )}
          <div className={styles.rightSection}>
            <h1 className={styles.title}>{content.title}</h1>

            <div className={styles.infoRow}>
              {/* {content.imdbRate && (
                <div className={styles.infoBox}>
                  <Icon name='star' strokeColor='secondary' />
                  <p className={styles.infoValue}>
                    {content.imdbRate.toFixed(1)}
                  </p>
                  <p className={styles.infoLabel}>IMDB</p>
                </div>
              )} */}
              {content.imdbRate && (
                <Badge
                  iconName='starFilled'
                  text='IMDB'
                  color='color-primary'
                  number={content.imdbRate}
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

            <div className={styles.genreList}>
              {genreList?.map(genre => (
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

            <p className={styles.description}>{content.description}</p>

            <div className={styles.actions}>
              {videoId && (
                <Button color='primary' onClick={handlePlayTrailer}>
                  <Icon name='play' strokeColor='white' />
                  Play Trailer
                </Button>
              )}
              <Button color='neutral'>
                <Icon name='bookmark' strokeColor='white' />
                Add to Watchlist
              </Button>
              <Button
                color='neutral'
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      url: window.location.href,
                      title: content.title,
                      text: content.description,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Icon name='share' strokeColor='white' />
              </Button>
              {videoId && (
                <Button color='neutral' onClick={toggleMute}>
                  {isMuted ? (
                    <Icon name='mute' strokeColor='white' />
                  ) : (
                    <Icon name='speaker' strokeColor='white' />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close Focus Mode & Volume Control */}
      {trailerFocusMode && player && (
        <VideoControls
          player={player}
          onClose={() => setTrailerFocusMode(false)}
        />
      )}
    </section>
  );
}
