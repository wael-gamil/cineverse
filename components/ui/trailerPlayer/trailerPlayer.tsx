// components/shared/TrailerPlayer.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './trailerPlayer.module.css';

type TrailerPlayerProps = {
  videoId: string;
  onEnd?: () => void;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  playerRef?: React.MutableRefObject<any | null>;
};

export default function TrailerPlayer({
  videoId,
  onEnd,
  focusMode,
  playerRef,
}: TrailerPlayerProps) {
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<any>(null);
  useEffect(() => {
    if (!videoId || player) return;

    const createPlayer = () => {
      if (!iframeRef.current) return;
      const newPlayer = new (window as any).YT.Player(iframeRef.current, {
        videoId,
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
            if (playerRef) {
              playerRef.current = newPlayer;
            }
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

  useEffect(() => {
    if (!focusMode || !player) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (duration - currentTime <= 10) {
        onEnd?.();
        player.seekTo(0, true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [focusMode, player]);
  return <div ref={iframeRef} className={styles.video} />;
}
