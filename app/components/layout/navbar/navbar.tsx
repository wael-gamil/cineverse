'use client';
import styles from '@/app/components/layout/navbar/navbar.module.css';
import { Icon } from '@/app/components/ui/icon/icon';
import { playfair } from '@/app/constants/fonts';
import { useState, useCallback } from 'react';
import NavLinks from '../../ui/navLinks/navLinks';
import Search from '../../ui/search/search';
import Button from '../../ui/button/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.navbar_Logo}>
        <Icon name='film' primaryStroke />
        <h1 className={`${styles.navbar_title} ${playfair.className}`}>
          CineVerse
        </h1>
      </div>

      {/* Burger Icon */}
      <div className={`${styles.navbar_Burger} ${isOpen ? styles.open : ''}`}>
        <Button onClick={toggleMenu} variant='primary' ariaLabel='Menu'>
          <div className={styles.iconWrapper}>
            <Icon name={isOpen ? 'close' : 'burger'} whiteStroke />
          </div>
        </Button>
      </div>

      {/* Desktop Links */}
      <NavLinks />

      {/* Right Side Actions */}
      <div className={styles.navbar_Actions}>
        <Search minimizeWhenSmall />

        {/* User Icon */}
        <Button>
          <Icon name='user' whiteStroke />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.navbar_MobileMenu}>
          <Search />
          <NavLinks isMobile closeMenu={closeMenu} />
          <Button align='left'>
            <Icon name='user' whiteStroke />
          </Button>
        </div>
      )}
    </nav>
  );
}
