import { useEffect, useState } from 'react';

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null until client

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);

    checkMobile(); // Initial run
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
