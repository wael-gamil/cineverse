'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../button/button';
import { Icon } from '../icon/icon';
export default function ExitButton() {
  const router = useRouter();
  const [fallbackUrl, setFallbackUrl] = useState('/');

  useEffect(() => {
    const lastVisited = sessionStorage.getItem('lastVisitedPath');
    if (lastVisited) setFallbackUrl(lastVisited);
  }, []);

  const handleExit = () => {
    router.push(fallbackUrl);
  };

  return (
    <Button onClick={handleExit} borderRadius='fullRadius' padding='none'>
      <Icon name='close' strokeColor='white' width={16} height={16} />
    </Button>
  );
}
