'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../../app/(App)/search/page.module.css';

type Props = {
  children: React.ReactNode;
};

export default function SearchPageClient({ children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll to top when the search page is mounted/opened or search params change
    const scrollToTop = () => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    };

    // Scroll to top immediately
    scrollToTop();

    // Also scroll to top after a small delay to handle any async loading
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [searchParams]); // Re-run when search params change

  // Prevent scroll restoration from browser
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <div ref={contentRef} className={styles.content}>
      {children}
    </div>
  );
}
