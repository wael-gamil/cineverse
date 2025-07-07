'use client';

import styles from './searchBar.module.css';
import { Icon } from '@/components/ui/icon/icon';
import Button from '../button/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SearchBar() {
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
      <div className={styles.searchBarMobile}>
        <Button
          variant='ghost'
          color='neutral'
          ariaLabel='Open Search'
          borderRadius='fullRadius'
          padding='none'
        >
          <Icon name='search' strokeColor='white' />
        </Button>
      </div>
      <div className={styles.searchBarDesktop}>
        <div className={styles.inputWrapper} role='button' tabIndex={0}>
          <Icon name='search' strokeColor='white' />
          <span className={styles.inputLabel}>Search movies, TV shows...</span>
        </div>
      </div>
    </Link>
  );
}
