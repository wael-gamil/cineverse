'use client';
import styles from './navbar.module.css';
import { Icon } from '@/components/ui/icon/icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '../../ui/navLinks/navLinks';
import SearchBar from '../../ui/search/searchBar';
import Button from '../../ui/button/button';
import { usePathname } from 'next/navigation';
import PanelWrapper from '@/components/ui/panelWrapper/panelWrapper';

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);

  const pathname = usePathname();

  const allowedPathsWithSpacer = [
    '/explore',
    '/reviews',
    '/search',
    '/watchlist',
    // '/',
    '/crew',
  ];
  const showSpacer = allowedPathsWithSpacer.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

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
      target.style.setProperty('--x', `50%`); 
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
        <Link href={'/explore/movies'} className={styles.navbarLogo}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconBackground}></div>
            <Icon name='film' strokeColor='primary' />
          </div>
          <h1 className={styles.navbarTitle}>
            <span className={styles.cine}>CINE</span>
            <span className={styles.verse}>VERSE</span>
          </h1>
        </Link>

        <div className={styles.navbarDesktop}>
          <NavLinks />
        </div>

        <div className={styles.navbarDesktop}>
          <SearchBar />
          <Button borderRadius='fullRadius' padding='none'>
            <Icon name='user' strokeColor='white' />
          </Button>
        </div>
        <div className={styles.navbarMobile}>
          <SearchBar />
          <PanelWrapper
            icon={isOpen => (
              <Icon
                name={isOpen ? 'close' : 'burger'}
                width={16}
                strokeColor='white'
              />
            )}
            position='right'
            padding='lg'
            solidPanel={true}
            varient='ghost'
            buttonRadius='full'
            buttonPadding='sm'
          >
            <NavLinks isMobile />
            <Button align='left' borderRadius='fullRadius' padding='none'>
              <Icon name='user' strokeColor='white' />
            </Button>
          </PanelWrapper>
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
