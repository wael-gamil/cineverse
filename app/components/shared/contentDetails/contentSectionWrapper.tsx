'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './contentSectionWrapper.module.css';
import { useIsInViewOnce } from '@/app/hooks/useIsInView';
import CreditsSection from './creditsSection';
import ReviewsSection from './reviewsSection';
import SeasonsSection from './seasonsSection';
import { Credits, Review, Season } from '@/app/constants/types/movie';

type SectionType = 'credits' | 'seasons' | 'reviews';

type ContentSectionWrapperProps = {
  section: SectionType;
  id: number;
};

export default function ContentSectionWrapper({
  section,
  id,
}: ContentSectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const isVisible = useIsInViewOnce(ref, '0px', 0.6);

  useEffect(() => {
    if (!isVisible || data) return;

    const fetchData = async () => {
      try {
        let response;
        switch (section) {
          case 'credits':
            response = await fetch(`/api/proxy/credits?id=${id}`);
            break;
          case 'reviews':
            response = await fetch(`/api/proxy/reviews?id=${id}`);
            break;
          case 'seasons':
            response = await fetch(`/api/proxy/seasons?id=${id}`);
            break;
          default:
            return;
        }

        if (!response.ok) {
          console.error(`Failed to fetch ${section}:`, response.status);
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(`Fetch error for ${section}:`, err);
      }
    };

    fetchData();
  }, [isVisible, id, section, data]);

  if (!data) return <div ref={ref} className={styles.container} />;
  console.log(`Rendering ${section} section with data:`, data);
  switch (section) {
    case 'credits':
      return <CreditsSection data={data as Credits} />;
    case 'seasons':
      return <SeasonsSection data={data as Season[]} seriesId={id} />;
    case 'reviews':
      return <ReviewsSection data={data as Review[]} />;
    default:
      return null;
  }
}
