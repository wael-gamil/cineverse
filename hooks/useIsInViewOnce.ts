import { useEffect, useState, RefObject } from 'react';

export function useIsInViewOnce<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = '0px',
  threshold = 0.5 
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, isVisible]);

  return isVisible;
}
