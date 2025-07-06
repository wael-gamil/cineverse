'use client';
import styles from './contentHero.module.css';
import { NormalizedContent } from '@/constants/types/movie';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoControls from '../../../ui/videoControls/videoControls';
import Button from '../../../ui/button/button';
import { Icon } from '../../../ui/icon/icon';
import Badge from '../../../ui/badge/badge';
import { useTrailerQuery } from '@/hooks/useTrailerQuery';
import TrailerPlayer from '@/components/ui/trailerPlayer/trailerPlayer';
import { useIsInView } from '@/hooks/useIsInView';

type ContentHeroProps = {
  content: NormalizedContent;
  backgroundUrl?: string;
  fallbackPoster?: string;
  genres?: string[];
};

function getYouTubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match && match[1] ? match[1] : '';
}

export default function ContentHero({
  content,
  backgroundUrl = '',
  fallbackPoster = '',
  genres,
}: ContentHeroProps) {
  const [trailerFocusMode, setTrailerFocusMode] = useState(false);
  const { data, isLoading } =
    content.type === 'movie' || content.type === 'series'
      ? useTrailerQuery(content.id)
      : { data: undefined };
  const trailerUrl = data?.trailer;
  const videoId = trailerUrl ? getYouTubeVideoId(trailerUrl) : null;
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
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isHeroVisible = useIsInView(sectionRef, '0px', 0.3);
  const [showBottomOverlay, setShowBottomOverlay] = useState(false);
  const toggleMute = () => {
    const player = playerRef.current;
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
  const handleExitingFocusMode = () => {
    setTimeout(() => {
      setTrailerFocusMode(false);
    }, 200);
    playerRef.current.mute();
    setIsMuted(true);
    playerRef.current.playVideo();
    setIsPlaying(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  const handlePlayTrailer = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setTrailerFocusMode(true);
      setIsFadingOut(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        togglePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    const state = playerRef.current.getPlayerState();
    const PLAYER_STATE =
      typeof window !== 'undefined' &&
      (window as any).YT &&
      (window as any).YT.PlayerState
        ? (window as any).YT.PlayerState
        : { PLAYING: 1, PAUSED: 2, CUED: 5 };

    if (state === PLAYER_STATE.PLAYING) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setShowBottomOverlay(true);
    } else if (state === PLAYER_STATE.PAUSED || state === PLAYER_STATE.CUED) {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setTimeout(() => {
        setShowBottomOverlay(false);
      }, 400);
    }
  };
  useEffect(() => {
    const player = playerRef.current;
    if (!player || typeof player.pauseVideo !== 'function') return;

    if (!isHeroVisible && !trailerFocusMode) {
      player.pauseVideo();
      setIsPlaying(false);
      setShowBottomOverlay(true);
    } else {
      player.playVideo();
      setIsPlaying(true);
      setTimeout(() => {
        setShowBottomOverlay(false);
      }, 400);
    }
  }, [isHeroVisible, trailerFocusMode]);
  return (
    <section className={styles.hero} ref={sectionRef}>
      {/* Background Video */}
      <div
        className={`${styles.background} ${
          trailerFocusMode ? styles.aboveEverything : ''
        }`}
        onClick={togglePlayPause}
      >
        {/* YouTube Player injected here */}
        {videoId ? (
          <TrailerPlayer
            videoId={videoId}
            focusMode={trailerFocusMode}
            setFocusMode={setTrailerFocusMode}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onEnd={handleExitingFocusMode}
            playerRef={playerRef}
          />
        ) : (
          <Image
            src={content.backgroundUrl || backgroundUrl}
            alt={content.title}
            fill
            className={`${styles.backdropImage} ${
              videoId ? styles.backdropHidden : ''
            }`}
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
          {showBottomOverlay && (
            <div
              className={`${styles.bottomOverlay} ${
                !showBottomOverlay ? styles.hidden : ''
              }`}
            />
          )}
        </>
      )}

      {/* Content Metadata */}
      {(!trailerFocusMode || isFadingOut) && (
        <div
          className={`${styles.container} ${isFadingOut ? styles.fadeOut : ''}`}
        >
          {!videoId && !isLoading && (
            <div className={styles.posterWrapper}>
              <Image
                src={content.imageUrl || fallbackPoster}
                alt={content.title}
                fill
                className={styles.posterImage}
              />
            </div>
          )}
          <div className={styles.rightSection}>
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
              {typeof runtime === 'number' && runtime > 0 && (
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
      {trailerFocusMode && playerRef.current && (
        <VideoControls
          player={playerRef.current}
          isPlayingInitial={isPlaying}
          onClose={handleExitingFocusMode}
        />
      )}
    </section>
  );
}
