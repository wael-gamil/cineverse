'use client';

import { useEffect, useRef, useState } from 'react';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import { Content, NormalizedContent } from '@/constants/types/movie';
import styles from './heroSectionWrapper.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';
import { useIsInView } from '@/hooks/useIsInView';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type HeroSectionWrapperProps = {
  contents: NormalizedContent[];
  rawContent: Content[];
};

export default function HeroSectionWrapper({
  contents,
  rawContent,
}: HeroSectionWrapperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef(null);
  const stillInView = useIsInView(wrapperRef, '0px', 0.3);
  const [isTrailerFocusMode, setIsTrailerFocusMode] = useState(false);
  const isMobile = useResponsiveLayout();
  const touchStartRef = useRef<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  // Helper to reset the auto-advance interval
  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stillInView && !isTrailerFocusMode) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % contents.length);
      }, 15000);
    }
  };

  const handleNext = () => {
    setActiveIndex(prev => {
      const next = (prev + 1) % contents.length;
      return next;
    });
    resetInterval();
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const delta = touchEnd - touchStartRef.current;

    const swipeThreshold = 50; // Minimum px to trigger swipe
    if (delta > swipeThreshold) handlePrev(); // swipe right
    else if (delta < -swipeThreshold) handleNext(); // swipe left

    touchStartRef.current = null;
  };
  const handlePrev = () => {
    setActiveIndex(prev => {
      const next = (prev - 1 + contents.length) % contents.length;
      return next;
    });
    resetInterval();
  };
  const resetHideTimeout = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowArrows(true); // show on interaction

    hideTimeoutRef.current = setTimeout(() => {
      setShowArrows(false); // hide after 3s
    }, 3000);
  };
  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stillInView, isTrailerFocusMode, contents.length]);

  useEffect(() => {
    const handleActivity = () => resetHideTimeout();

    // Mouse & touch interaction
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity);

    resetHideTimeout(); // Start countdown on mount

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);

      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    if (!isMobile) return;

    setShowHint(true); // show on mount

    const hideHint = () => setShowHint(false);

    const timeout = setTimeout(hideHint, 4000); // auto-hide after 4s

    // Also hide if the user interacts (touch or scroll)
    window.addEventListener('touchstart', hideHint, { once: true });
    window.addEventListener('scroll', hideHint, { once: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', hideHint);
      window.removeEventListener('scroll', hideHint);
    };
  }, [isMobile]);
  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isMobile && (
        <div className={styles.externalLink}>
          <Button variant='ghost' padding='sm' borderRadius='fullRadius'>
            <Link href={`/${rawContent[activeIndex].slug}`} target='_blank'>
              <Icon name='ExternalLink' strokeColor='white' />
            </Link>
          </Button>
        </div>
      )}

      {!isMobile && (
        <>
          <div
            className={`${styles.arrowLeft} ${
              !showArrows ? styles.hidden : ''
            }`}
          >
            <Button
              onClick={handlePrev}
              variant='solid'
              padding='sm'
              borderRadius='fullRadius'
            >
              <Icon name='arrow-left' strokeColor='white' />
            </Button>
          </div>
          <div
            className={`${styles.arrowRight} ${
              !showArrows ? styles.hidden : ''
            }`}
          >
            <Button
              onClick={handleNext}
              variant='solid'
              padding='sm'
              borderRadius='fullRadius'
            >
              <Icon name='arrow-right' strokeColor='white' />
            </Button>
          </div>
        </>
      )}
      {isMobile && showHint && (
        <div className={styles.swipeHint}>
          <Icon name='arrow-right' strokeColor='white' />
          <span>Swipe</span>
        </div>
      )}

      <ContentHero
        key={contents[activeIndex].id}
        content={contents[activeIndex]}
        onFocusModeChange={setIsTrailerFocusMode}
        showExternalLink={isMobile ? isMobile : undefined}
        slug={rawContent[activeIndex].slug}
      />

      <div className={styles.dotIndicator}>
        {contents.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => {
              setActiveIndex(index);
              resetInterval();
            }}
          />
        ))}
      </div>
      <div className={styles.scrollIndicator}>
        <Icon name='chevron-down' strokeColor='white' />
        Scroll
      </div>
    </div>
  );
}
