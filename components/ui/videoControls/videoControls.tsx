'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icon/icon';
import styles from './videoControls.module.css';
import Button from '../button/button';

interface VideoControlsProps {
  player: any;
  isPlayingInitial: boolean;
  onClose: () => void;
}

export default function VideoControls({
  player,
  isPlayingInitial,
  onClose,
}: VideoControlsProps) {
  const [isPlaying, setIsPlaying] = useState(isPlayingInitial);
  useEffect(() => {
    if (isPlayingInitial) {
      player.playVideo();
      setTimeout(() => {
        setIsPlaying(true);
      }, 300);
    } else {
      setTimeout(() => {
        player.pauseVideo();
      }, 100);
      setIsPlaying(false);
    }
  }, [isPlayingInitial]);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const croppedDuration = Math.max(0, duration - 10);
  const fillPercent = croppedDuration
    ? Math.min(100, Math.max(0, (progress / croppedDuration) * 100))
    : 0;
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setFullscreen] = useState(false);
  const hideTimeout = useRef<number | undefined>(undefined);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if (!player || typeof player.getVolume !== 'function') return;

    const tick = () => {
      setProgress(player.getCurrentTime());
      setDuration(player.getDuration());
    };

    const interval = setInterval(tick, 500);

    const initialVolume = 20;
    player.unMute();
    player.setVolume(initialVolume);
    setMuted(false);
    setVolume(initialVolume);
    player.playVideo();

    return () => clearInterval(interval);
  }, [player]);

  const resetHide = () => {
    window.clearTimeout(hideTimeout.current);
    setShowControls(true);
    hideTimeout.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const mouseHandler = () => resetHide();

    document.addEventListener('mousemove', mouseHandler);
    resetHide();

    return () => {
      document.removeEventListener('mousemove', mouseHandler);
      window.clearTimeout(hideTimeout.current);
    };
  }, [isPlaying]);

  const toggleMute = () => {
    if (muted) {
      player.unMute();
      const currentVolume = player.getVolume();
      setVolume(currentVolume > 0 ? currentVolume : 20);
    } else {
      player.mute();
      setVolume(0);
    }
    setMuted(!muted);
    resetHide();
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    player.setVolume(value);
    setVolume(value);
    if (value === 0) {
      player.mute();
      setMuted(true);
    } else {
      player.unMute();
      setMuted(false);
    }
    resetHide();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), croppedDuration);
    player.seekTo(value, true);
    setProgress(value);
    resetHide();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setFullscreen(!isFullscreen);
    resetHide();
  };
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);
  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      setTimeout(() => {
        player.pauseVideo();
      }, 100);
      setIsPlaying(!isPlaying);
    } else {
      player.playVideo();
      setTimeout(() => {
        setIsPlaying(!isPlaying);
      }, 300);
    }
    resetHide();
  };
  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    setIsIOS(isIOSDevice);
  }, []);
  return (
    <>
      {/* {!isPlaying && <div className={styles.pauseOverlay}></div>} */}
      <div
        className={`${styles.controls} ${
          isPlaying ? (showControls ? '' : styles.hidden) : ''
        }${!isPlaying ? styles.playing : ''}`}
      >
        <input
          type='range'
          min='0'
          max={croppedDuration}
          value={progress}
          onChange={onSeek}
          className={styles.progress}
          style={{
            background: `linear-gradient(to right, var(--color-primary) ${fillPercent}%, var(--color-muted) ${fillPercent}%)`,
          }}
        />

        <div className={styles.controlsRow}>
          <div className={styles.controlsRow}>
            <Button
              onClick={togglePlay}
              variant='ghost'
              color='neutral'
              padding='sm'
            >
              <Icon name={isPlaying ? 'pause' : 'play'} strokeColor='white' />
            </Button>
            <div className={styles.time}>
              {formatTime(Math.min(progress, croppedDuration))} /
              {formatTime(croppedDuration)}
            </div>
          </div>
          {!isPlaying && (
            <div className={styles.pauseMessage}>
              <p>Paused. Take a moment, then press play when you're ready.</p>
            </div>
          )}
          <div className={styles.rightSection}>
            <div className={styles.volumeWrapper}>
              <Button
                onClick={toggleMute}
                variant='ghost'
                color='neutral'
                padding='sm'
              >
                <Icon
                  name={
                    muted || volume === 0
                      ? 'mute'
                      : volume < 40
                      ? 'speaker-mini'
                      : 'speaker'
                  }
                  strokeColor='white'
                />
              </Button>
              <div className={styles.volumePopup}>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={volume}
                  onChange={onVolume}
                  className={styles.volumeBar}
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${
                      (volume / 100) * 100
                    }%, var(--color-muted) ${(volume / 100) * 100}%)`,
                  }}
                />
              </div>
            </div>
            {!isIOS && (
              <Button
                onClick={toggleFullscreen}
                variant='ghost'
                color='neutral'
                padding='sm'
              >
                <Icon
                  name={isFullscreen ? 'contract' : 'expand'}
                  strokeColor='white'
                />
              </Button>
            )}

            <Button
              onClick={onClose}
              variant='ghost'
              color='danger'
              padding='sm'
            >
              ✕
            </Button>
          </div>
        </div>
        {!isPlaying && (
          <div className={styles.mobilePauseMessage}>
            <p>Paused. Take a moment, then press play when you're ready.</p>
          </div>
        )}
      </div>
    </>
  );
}

function formatTime(t: number): string {
  const m = Math.floor(t / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
