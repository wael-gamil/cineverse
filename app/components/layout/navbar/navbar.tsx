'use client';
import styles from './navbar.module.css';
import { Icon } from '@/app/components/ui/icon/icon';
import { playfair } from '@/app/constants/fonts';
import { useState, useCallback } from 'react';
import NavLinks from '../../ui/navLinks/navLinks';
import Search from '../../ui/search/search';
import Button from '../../ui/button/button';
import useIsMobile from '@/app/hooks/useIsMobile';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile(850);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.navbar_Logo}>
        <Icon name='film' strokeColor='primary' width={30} height={30} />
        <h1 className={`${styles.navbar_title} ${playfair.className}`}>
          CineVerse
        </h1>
      </div>

      {/* Mobile Burger Toggle */}
      {isMobile && (
        <div className={`${styles.navbar_Burger} ${isOpen ? styles.open : ''}`}>
          <Button
            variant='ghost'
            color='neutral'
            size='small'
            ariaLabel='Toggle Menu'
            onClick={toggleMenu}
            borderRadius='fullRadius'
          >
            <div className={styles.iconWrapper}>
              <Icon name={isOpen ? 'close' : 'burger'} strokeColor='white' />
            </div>
          </Button>
        </div>
      )}

      {/* Nav Links */}
      {!isMobile ? (
        <NavLinks />
      ) : (
        isOpen && (
          <div className={styles.navbar_MobileMenu}>
            <Search />
            <NavLinks isMobile closeMenu={closeMenu} />
            <Button align='left' borderRadius='fullRadius'>
              <Icon name='user' strokeColor='white' />
            </Button>
          </div>
        )
      )}

      {/* Actions (Search + User icon) */}
      {!isMobile && (
        <div className={styles.navbar_Actions}>
          <Search minimizeWhenSmall />
          <Button borderRadius='fullRadius'>
            <Icon name='user' strokeColor='white' />
          </Button>
        </div>
      )}
    </nav>
  );
}
