import { useEffect, useState, RefObject } from 'react';

export function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = '0px',
  threshold = 0.5
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin, threshold }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isVisible;
}
