'use client';
import styles from './contentHero.module.css';
import { NormalizedContent } from '@/constants/types/movie';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoControls from '../../../ui/videoControls/videoControls';
import { useTrailerQuery } from '@/hooks/useTrailerQuery';
import TrailerPlayer from '@/components/ui/trailerPlayer/trailerPlayer';
import { useIsInView } from '@/hooks/useIsInView';
import HeroMetadata from './heroMetadata';
import { uiStore } from '@/utils/uiStore';
import useMobileVh from '@/hooks/useMobileVh';

type ContentHeroProps = {
  content: NormalizedContent;
  backgroundUrl?: string;
  fallbackPoster?: string;
  genres?: string[];
  onFocusModeChange?: (isFocus: boolean) => void;
  showExternalLink?: boolean;
  slug?: string;
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
  onFocusModeChange,
  showExternalLink,
  slug,
}: ContentHeroProps) {
  useMobileVh();
  const [trailerFocusMode, setTrailerFocusMode] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerLoaded, setTrailerLoaded] = useState(false);

  const { data, isLoading } =
    content.type === 'movie' || content.type === 'series'
      ? useTrailerQuery(content.id)
      : { data: undefined };
  const trailerUrl = data?.trailer;
  const videoId = trailerUrl ? getYouTubeVideoId(trailerUrl) : null;
  const [isMuted, setIsMuted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
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
  // Handle smooth transition from poster to trailer
  useEffect(() => {
    if (videoId && !isLoading) {
      // Delay showing trailer to allow for smooth transition
      const timer = setTimeout(() => {
        setShowTrailer(true);
        // Set trailer loaded after a brief delay to allow for fade-in
        setTimeout(() => {
          setTrailerLoaded(true);
        }, 300);
      }, 800); // 800ms delay for transition

      return () => clearTimeout(timer);
    } else {
      setShowTrailer(false);
      setTrailerLoaded(false);
    }
  }, [videoId, isLoading]);
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
      uiStore.setState(state => ({ ...state, trailerFocusMode: false }));
      onFocusModeChange?.(false);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playerRef.current.unMute();
    setIsMuted(false);
    playerRef.current.playVideo();
    setTimeout(() => {
      setTrailerFocusMode(true);
      uiStore.setState(state => ({ ...state, trailerFocusMode: true }));
      onFocusModeChange?.(true);
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
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (trailerFocusMode) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.touchAction = '';
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.touchAction = '';
    };
  }, [trailerFocusMode]);
  return (
    <section className={styles.hero} ref={sectionRef}>
      <div
        className={styles.videoWrapper}
        style={
          trailerFocusMode ? { minHeight: 'calc(var(--vh, 1vh) * 100)' } : {}
        }
        id='videoWrapper'
      >
        {' '}
        {/* Background Video */}
        <div
          className={`${styles.background} ${
            trailerFocusMode ? styles.aboveEverything : ''
          }`}
          onClick={togglePlayPause}
        >
          {/* Poster Image - always render but fade out when trailer loads */}
          <Image
            src={content.backgroundUrl || backgroundUrl}
            alt={content.title}
            fill
            className={`${styles.backdropImage} ${
              showTrailer && trailerLoaded ? styles.backdropHidden : ''
            }`}
          />
          {/* YouTube Player - fade in when ready */}
          {showTrailer && (
            <div
              className={`${styles.trailerContainer} ${
                trailerLoaded ? styles.trailerVisible : styles.trailerHidden
              }`}
            >
              <TrailerPlayer
                videoId={videoId!}
                focusMode={trailerFocusMode}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onEnd={handleExitingFocusMode}
                playerRef={playerRef}
              />
            </div>
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
            className={`${styles.container} ${
              isFadingOut ? styles.fadeOut : ''
            }`}
          >
            {(!showTrailer || !trailerLoaded) && (
              <div className={styles.posterWrapper}>
                <Image
                  src={content.imageUrl || fallbackPoster}
                  alt={content.title}
                  fill
                  className={styles.posterImage}
                />
              </div>
            )}
            <HeroMetadata
              content={content}
              runtime={runtime}
              fallbackPoster={fallbackPoster}
              trailerAvailable={!!videoId}
              isMuted={isMuted}
              onPlayTrailer={handlePlayTrailer}
              onToggleMute={toggleMute}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({
                    url: slug
                      ? `${window.location.origin}/${encodeURI(slug)}`
                      : window.location.href,
                    title: content.title,
                    text: content.description,
                  });
                } else {
                  navigator.clipboard.writeText(
                    slug
                      ? `${window.location.origin}/${encodeURI(slug)}`
                      : window.location.href
                  );
                  alert('Link copied to clipboard!');
                }
              }}
              genres={genres}
            />
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
      </div>{' '}
      {/* Mobile Metadata */}
      <div className={styles.mobileContainer}>
        {(!showTrailer || !trailerLoaded) && (
          <div className={styles.posterWrapper}>
            <Image
              src={content.imageUrl || fallbackPoster}
              alt={content.title}
              fill
              className={styles.posterImage}
            />
          </div>
        )}
        <HeroMetadata
          content={content}
          runtime={runtime}
          fallbackPoster={fallbackPoster}
          trailerAvailable={!!videoId}
          isMuted={isMuted}
          onPlayTrailer={handlePlayTrailer}
          onToggleMute={toggleMute}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                url: slug
                  ? `${window.location.origin}/${encodeURI(slug)}`
                  : window.location.href,
                title: content.title,
                text: content.description,
              });
            } else {
              navigator.clipboard.writeText(
                slug
                  ? `${window.location.origin}/${encodeURI(slug)}`
                  : window.location.href
              );
              alert('Link copied to clipboard!');
            }
          }}
          genres={genres}
          showExternalLink={showExternalLink}
          slug={slug}
        />
      </div>
    </section>
  );
}
