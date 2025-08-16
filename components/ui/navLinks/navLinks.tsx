import styles from './navLinks.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  const handleClick = (e: React.MouseEvent, path: string) => {
    if (closeMenu) closeMenu();

    if (path === '/watchlist') {
      e.preventDefault();
      // Force a full navigation so the browser includes cookies and avoids
      // Next's RSC/prefetch fetch path that can be redirected by middleware.
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  };

  return (
    <ul className={`${styles.navLinks} ${isMobile ? styles.mobile : ''}`}>
      {NAV_LINKS.map(({ name, path }) => (
        <li key={name}>
          <Link
            href={path}
            prefetch={path === '/watchlist' ? false : undefined}
            className={`${styles.navbar_item} ${
              pathname === path ? styles.active : ''
            }`}
            onClick={(e) => handleClick(e, path)}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
