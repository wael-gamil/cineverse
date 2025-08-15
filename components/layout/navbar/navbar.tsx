'use client';
import styles from './navbar.module.css';
import { Icon } from '@/components/ui/icon/icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '../../ui/navLinks/navLinks';
import SearchBar from '../../ui/search/searchBar';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import PanelWrapper from '@/components/ui/panelWrapper/panelWrapper';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import UserPanel from './userPanel';
import Button from '@/components/ui/button/button';
import { uiStore } from '@/utils/uiStore';
import { useShowSpacer } from '@/hooks/useShowSpacer';

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isShrunk, setIsShrunk] = useState(false);
  const [closeMobilePanel, setCloseMobilePanel] = useState<() => void>(() => () => {});
  const [closeUserPanel, setCloseUserPanel] = useState<() => void>(() => () => {});
  const { email, username } = useStore(userStore);
  const isLoggedIn = !!email && !!username;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useResponsiveLayout();
  const { trailerFocusMode } = useStore(uiStore);
  const showSpacer = useShowSpacer(isMobile ?? false, trailerFocusMode);

  // Helper function to handle login with menu closing
  const handleLogin = () => {
    closeMobilePanel();
    router.push(getLoginUrl());
  };
  const getLoginUrl = () => {
    const currentPath =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Don't store auth pages as redirect URLs
    const authRoutes = ['/login', '/register', '/forget-password', '/auth'];
    const isAuthPage = authRoutes.some(route => pathname.startsWith(route));
    
    if (isAuthPage) {
      return '/login'; // Just go to login without redirect parameter
    }
    
    return `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

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
            {!hasMounted ? (
              // Loading state before userStore is ready
              <Button
                variant='solid'
                color='neutral'
                padding='none'
                borderRadius='fullRadius'
                disabled
                title='Loading...'
              >
                <Icon
                  name='loader'
                  width={20}
                  strokeColor='white'
                  className={styles.spin}
                />
              </Button>
            ) : isLoggedIn ? (
              <PanelWrapper
                label='Account'
                icon={isOpen => (
                  <Icon
                    name={isOpen ? 'close' : 'user'}
                    width={16}
                    strokeColor='primary'
                  />
                )}
                badge={hasMounted ? username || undefined : undefined}
                position='right'
                padding='lg'
                solidPanel
                varient='solid'
                buttonRadius='full'
                buttonPadding='sm'
                relativePanel
                setClose={setCloseUserPanel}
              >
                <UserPanel closePanel={closeUserPanel} />
              </PanelWrapper>
            ) : (
              <Link href={getLoginUrl()}>
                <Button
                  variant='solid'
                  color='neutral'
                  padding='none'
                  borderRadius='fullRadius'
                  title='Login'
                >
                  <Icon name='user' width={24} strokeColor='white' />
                </Button>
              </Link>
            )}
          </div>
          <div className={styles.navbarMobile}>
            <SearchBar />
            <PanelWrapper
              label={!isMobile ? 'Menu' : undefined}
              icon={isOpen => (
                <Icon
                  name={isOpen ? 'close' : 'burger'}
                  width={16}
                  strokeColor='white'
                />
              )}
              badge={
                !isMobile && hasMounted && isLoggedIn && username
                  ? username
                  : undefined
              }
              position='right'
              padding='lg'
              solidPanel={true}
              varient='ghost'
              buttonRadius='full'
              buttonPadding='sm'
              width='full'
              setClose={setCloseMobilePanel}
            >
              <NavLinks isMobile closeMenu={closeMobilePanel} />
              <div className={styles.divider}></div>
              {!hasMounted ? (
                <Button variant='solid' color='primary' width='100%' disabled title='Loading...'>
                  <Icon
                    name='loader'
                    width={20}
                    strokeColor='white'
                    className={styles.spin}
                  />
                </Button>
              ) : isLoggedIn ? (
                <UserPanel closePanel={closeMobilePanel} />
              ) : (
                <Button
                  variant='solid'
                  color='primary'
                  width='100%'
                  onClick={handleLogin}
                >
                  Login
                </Button>
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
