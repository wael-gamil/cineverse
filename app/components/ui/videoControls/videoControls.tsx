'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icon/icon';
import styles from './videoControls.module.css';

interface VideoControlsProps {
  player: any;
  onClose: () => void;
}

export default function VideoControls({ player, onClose }: VideoControlsProps) {
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
    return () => document.removeEventListener('mousemove', mouseHandler);
  }, []);

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

  return (
    <div className={`${styles.controls} ${showControls ? '' : styles.hidden}`}>
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
        <div className={styles.time}>
          {formatTime(Math.min(progress, croppedDuration))} /
          {formatTime(croppedDuration)}
        </div>
        <div className={styles.rightSection}>
          <div className={styles.volumeWrapper}>
            <button onClick={toggleMute} className={styles.controlBtn}>
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
            </button>
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

          <button onClick={toggleFullscreen} className={styles.controlBtn}>
            <Icon
              name={isFullscreen ? 'contract' : 'expand'}
              strokeColor='white'
            />
          </button>

          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>
      </div>
    </div>
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
