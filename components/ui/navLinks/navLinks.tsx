import styles from './navLinks.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@tanstack/react-store';
import { userStore, debugLog } from '@/utils/userStore';

type NavLinksProps = {
  isMobile?: boolean;
  closeMenu?: () => void;
};

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/explore/movies' },
  { name: 'TV Series', path: '/explore/tv-series' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Watchlist', path: '/watchlist' },
];

export default function NavLinks({
  isMobile = false,
  closeMenu,
}: NavLinksProps) {
  const pathname = usePathname();
  const { username, email, isHydrated } = useStore(userStore);

  const handleLinkClick = (path: string, name: string) => {
    // Debug logging for watchlist navigation issue
    debugLog(`NavLink Clicked: ${name}`, {
      path,
      name,
      pathname,
      username: !!username,
      email: !!email,
      isHydrated,
      isAuthenticated: !!(username && email),
      timestamp: new Date().toISOString(),
    });
    
    if (closeMenu) {
      closeMenu();
    }
  };

  return (
    <ul className={`${styles.navLinks} ${isMobile ? styles.mobile : ''}`}>
      {NAV_LINKS.map(({ name, path }) => (
        <li key={name}>
          <Link
            href={path}
            className={`${styles.navbar_item} ${
              pathname === path ? styles.active : ''
            }`}
            onClick={() => handleLinkClick(path, name)}
            prefetch={path !== '/watchlist'} // Disable prefetch for watchlist
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
