'use client';
import styles from './navbar.module.css';
import { Icon } from '@/components/ui/icon/icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '../../ui/navLinks/navLinks';
import SearchBar from '../../ui/search/searchBar';
import { usePathname } from 'next/navigation';
import PanelWrapper from '@/components/ui/panelWrapper/panelWrapper';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import UserPanel from './userPanel';
import Button from '@/components/ui/button/button';
import { uiStore } from '@/utils/uiStore';

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [closePanel, setClosePanel] = useState<() => void>(() => () => {});
  const { email, username } = useStore(userStore);
  const isLoggedIn = !!email && !!username;
  const pathname = usePathname();
  const isMobile = useResponsiveLayout();
  const { trailerFocusMode } = useStore(uiStore);
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
    !trailerFocusMode &&
    (allowedPathsWithSpacer.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    ) ||
      isSingleSlugPage);

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
            {isLoggedIn ? (
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
                solidPanel
                varient='solid'
                buttonRadius='full'
                buttonPadding='sm'
                setClose={setClosePanel}
              >
                <UserPanel closePanel={closePanel} />
              </PanelWrapper>
            ) : (
              <Link href='/login'>
                <Button
                  variant='solid'
                  color='neutral'
                  padding='none'
                  borderRadius='fullRadius'
                >
                  <Icon name={'user'} width={24} strokeColor='white' />
                </Button>
              </Link>
            )}
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
              setClose={setClosePanel}
            >
              <NavLinks isMobile closeMenu={closePanel} />
              <div className={styles.divider}></div>
              {isLoggedIn ? (
                <UserPanel closePanel={closePanel} />
              ) : (
                <Link href='/login'>
                  <Button
                    variant='solid'
                    color='primary'
                    width='100%'
                    onClick={closePanel}
                  >
                    Login
                  </Button>
                </Link>
              )}
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
