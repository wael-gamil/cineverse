'use client';
import styles from './navbar.module.css';
import { Icon } from '@/components/ui/icon/icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '../../ui/navLinks/navLinks';
import SearchBar from '../../ui/search/searchBar';
import { usePathname } from 'next/navigation';
import PanelWrapper from '@/components/ui/panelWrapper/panelWrapper';
import Image from 'next/image';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);

  const pathname = usePathname();
  const isMobile = useResponsiveLayout();
  const allowedPathsWithSpacer = [
    '/explore',
    '/reviews',
    '/search',
    '/watchlist',
    '/crew',
    ...(isMobile ? ['/', '/dynamic-slug'] : []),
  ];
  const isSingleSlugPage =
    isMobile &&
    /^\/[^/]+$/.test(pathname) &&
    !allowedPathsWithSpacer.includes(pathname);

  const showSpacer =
    allowedPathsWithSpacer.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    ) || isSingleSlugPage;

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
        <div className={styles.wrapper}>
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

          <div className={styles.navbarDesktop}>
            <NavLinks />
          </div>

          <div className={styles.navbarDesktop}>
            <SearchBar />
            <PanelWrapper
              icon={isOpen => (
                <Icon
                  name={isOpen ? 'close' : 'user'}
                  width={24}
                  strokeColor='primary'
                />
              )}
              position='right'
              padding='lg'
              solidPanel={true}
              varient='solid'
              buttonRadius='full'
              buttonPadding='sm'
            >
              <div className={styles.cta}>
                <Link href='/'>View Profile</Link>
                <span className={styles.separator}>•</span>
                <Link href='/'>Logout</Link>
              </div>
              {/* <div className={styles.userInfo}>
                <div className={styles.headerInfo}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src='https://image.tmdb.org/t/p/w500/zpIK3GYmqDPumneEDf0aqsqxhV1.jpg'
                      alt='User profile picture'
                      fill
                    />
                  </div>
                  <div className={styles.headerText}>
                    <h3>Wael Gamil</h3>
                    <p>waelgamil122@gmail.com</p>
                  </div>
                </div>

                <div className={styles.cta}>
                  <Link href='/'>View Profile</Link>
                  <span className={styles.separator}>•</span>
                  <Link href='/'>Logout</Link>
                </div>
              </div> */}
            </PanelWrapper>
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
              width='full'
            >
              <NavLinks isMobile />
              <div className={styles.divider}></div>

              <div className={styles.userInfo}>
                <div className={styles.headerInfo}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src='https://image.tmdb.org/t/p/w500/zpIK3GYmqDPumneEDf0aqsqxhV1.jpg'
                      alt='User profile picture'
                      fill
                    />
                  </div>
                  <div className={styles.headerText}>
                    <h3>Wael Gamil</h3>
                    <p>waelgamil122@gmail.com</p>
                  </div>
                </div>

                <div className={styles.cta}>
                  <Link href='/'>View Profile</Link>
                  <span className={styles.separator}>•</span>
                  <Link href='/'>Logout</Link>
                </div>
              </div>
            </PanelWrapper>
          </div>
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
