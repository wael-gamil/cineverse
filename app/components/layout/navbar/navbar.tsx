'use client';
import styles from './navbar.module.css';
import { Icon } from '@/app/components/ui/icon/icon';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '../../ui/navLinks/navLinks';
import SearchBar from '../../ui/search/searchBar';
import Button from '../../ui/button/button';
import useIsMobile from '@/app/hooks/useIsMobile';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const isMobile = useIsMobile(930);

  const pathname = usePathname();

  const allowedPathsWithSpacer = [
    '/explore',
    '/reviews',
    '/search',
    '/watchlist',
    '/',
  ];
  const showSpacer = allowedPathsWithSpacer.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      target.style.setProperty('--x', `${x}%`);
    };

    const handleLeave = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      target.style.setProperty('--x', `50%`); // Reset to center
    };

    const addListeners = (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) {
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
      }
      return el;
    };

    const removeListeners = (el: HTMLElement | null) => {
      if (el) {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      }
    };

    const cine = addListeners(`.${styles.cine}`);
    const verse = addListeners(`.${styles.verse}`);

    return () => {
      removeListeners(cine);
      removeListeners(verse);
    };
  }, []);

  return (
    <>
      <nav
        className={`${styles.navbar} ${isShrunk ? styles.navbarShrunk : ''}`}
      >
        {/* Logo Section */}
        <Link href={'/'} className={styles.navbarLogo}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconBackground}></div>
            <Icon name='film' strokeColor='primary' />
          </div>
          <h1 className={styles.navbarTitle}>
            <span className={styles.cine}>CINE</span>
            <span className={styles.verse}>VERSE</span>
          </h1>
        </Link>

        {/* Navigation Links (Desktop: always visible, Mobile: in menu) */}
        {!isMobile ? (
          <NavLinks />
        ) : (
          isOpen && (
            <div className={styles.navbarMobileMenu}>
              <NavLinks isMobile closeMenu={closeMenu} />
              <Button align='left' borderRadius='fullRadius'>
                <Icon name='user' strokeColor='white' />
              </Button>
            </div>
          )
        )}

        {/* Actions Section (Search and User Icon, only on Desktop) */}
        <div className={styles.navbarActions}>
          <SearchBar />
          {!isMobile ? (
            <Button borderRadius='fullRadius'>
              <Icon name='user' strokeColor='white' />
            </Button>
          ) : (
            <div
              className={`${styles.navbarBurger} ${isOpen ? styles.open : ''}`}
            >
              <Button
                variant='ghost'
                color='neutral'
                size='small'
                ariaLabel='Toggle Menu'
                onClick={toggleMenu}
                borderRadius='fullRadius'
              >
                <div className={styles.iconWrapper}>
                  <Icon
                    name={isOpen ? 'close' : 'burger'}
                    strokeColor='white'
                  />
                </div>
              </Button>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer to preserve layout when navbar shrinks */}
      {showSpacer && (
        <div
          className={`${styles.navbarSpacer} ${isShrunk ? styles.shrunk : ''}`}
        />
      )}
    </>
  );
}
