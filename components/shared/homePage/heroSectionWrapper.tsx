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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef(null);
  const stillInView = useIsInView(wrapperRef, '0px', 0.3);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % contents.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + contents.length) % contents.length);
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (stillInView) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % contents.length);
      }, 15000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stillInView, contents.length]);
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.externalLink}>
        <Button variant='ghost' padding='sm' borderRadius='fullRadius'>
          <Link href={`/${rawContent[activeIndex].slug}`} target='_blank'>
            <Icon name='ExternalLink' strokeColor='white' />
          </Link>
        </Button>
      </div>
      <div className={styles.arrowLeft}>
        <Button
          onClick={handlePrev}
          variant='outline'
          padding='sm'
          borderRadius='fullRadius'
        >
          <Icon name='arrow-left' strokeColor='white' />
        </Button>
      </div>

      <div className={styles.arrowRight}>
        <Button
          onClick={handleNext}
          variant='outline'
          padding='sm'
          borderRadius='fullRadius'
        >
          <Icon name='arrow-right' strokeColor='white' />
        </Button>
      </div>

      <ContentHero
        key={contents[activeIndex].id}
        content={contents[activeIndex]}
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
