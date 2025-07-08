'use client';

import { useEffect, useRef, useState } from 'react';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import { Content, NormalizedContent } from '@/constants/types/movie';
import styles from './heroSectionWrapper.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';
import { useIsInView } from '@/hooks/useIsInView';

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

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % contents.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + contents.length) % contents.length);
  };
  const resetHideTimeout = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowArrows(true); // show on interaction

    hideTimeoutRef.current = setTimeout(() => {
      setShowArrows(false); // hide after 3s
    }, 3000);
  };
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (stillInView && !isTrailerFocusMode) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % contents.length);
      }, 5000);
    }

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

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.externalLink}>
        <Button variant='ghost' padding='sm' borderRadius='fullRadius'>
          <Link href={`/${rawContent[activeIndex].slug}`} target='_blank'>
            <Icon name='ExternalLink' strokeColor='white' />
          </Link>
        </Button>
      </div>
      <div
        className={`${styles.arrowLeft} ${!showArrows ? styles.hidden : ''}`}
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
        className={`${styles.arrowRight} ${!showArrows ? styles.hidden : ''}`}
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

      <ContentHero
        key={contents[activeIndex].id}
        content={contents[activeIndex]}
        onFocusModeChange={setIsTrailerFocusMode}
      />

      <div className={styles.dotIndicator}>
        {contents.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => setActiveIndex(index)}
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
