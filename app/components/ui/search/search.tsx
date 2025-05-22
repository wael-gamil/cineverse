import styles from './search.module.css';
import { Icon } from '@/app/components/ui/icon/icon';
import { useState, useEffect, useCallback } from 'react';
import Button from '../button/button';

type SearchProps = {
  minimizeWhenSmall?: boolean;
};

export default function Search({ minimizeWhenSmall = false }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // set active to true when screen size is smaller than 1200px
  // and set active to false when screen size is larger than 1200px
  const handleResize = useCallback(() => {
    if (window.innerWidth < 1200) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 50);
  };

  return (
    <div
      className={`${styles.searchWrapper} ${
        minimizeWhenSmall ? styles.searchWrapperMinimize : ''
      }`}
    >
      {minimizeWhenSmall ? (
        <Button
          onClick={toggleSearch}
          aria-label='Search'
          disabled={!isActive}
          variant='secondary'
        >
          <Icon name='search' whiteStroke />
        </Button>
      ) : (
        <Icon name='search' whiteStroke />
      )}

      {/* original input */}
      <input
        type='text'
        placeholder='Search movies, tv series...'
        className={`${styles.searchInput} ${
          minimizeWhenSmall ? styles.minimize : ''
        }`}
      />

      {/* dropdown input */}
      {isOpen && (
        <input
          type='text'
          placeholder='Search movies, tv series...'
          className={`${styles.searchInput} ${styles.drawerSearchInput}`}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </div>
  );
}
