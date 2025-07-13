import { useEffect } from 'react';

export default function useMobileVh() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh(); // Set on load
    window.addEventListener('resize', setVh); // Update on resize (address bar show/hide)

    return () => window.removeEventListener('resize', setVh);
  }, []);
}
