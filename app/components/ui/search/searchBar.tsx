'use client';

import styles from './searchBar.module.css';
import { Icon } from '@/app/components/ui/icon/icon';
import Button from '../button/button';
import useIsMobile from '@/app/hooks/useIsMobile';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SearchBar() {
  const isCompact = useIsMobile(1200); // returns true on tablets/mobiles

  const pathname = usePathname();

  const handleStoreLastPath = () => {
    sessionStorage.setItem('lastVisitedPath', pathname);
  };

  return (
    <Link
      href={'/search'}
      onClick={handleStoreLastPath}
      className={styles.searchBar}
    >
      {isCompact ? (
        <Button
          variant='ghost'
          color='neutral'
          ariaLabel='Open Search'
          borderRadius='fullRadius'
          padding='none'
        >
          <Icon name='search' strokeColor='white' />
        </Button>
      ) : (
        <div className={styles.inputWrapper} role='button' tabIndex={0}>
          <Icon name='search' strokeColor='white' />
          <span className={styles.inputLabel}>Search movies, TV shows...</span>
        </div>
      )}
    </Link>
  );
}
