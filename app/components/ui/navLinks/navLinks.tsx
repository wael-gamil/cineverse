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

export default function NavLinks({ isMobile = false, closeMenu }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul
      className={styles.navLinks}
      data-mobile={isMobile ? 'true' : 'false'}
    >
      {NAV_LINKS.map(({ name, path }) => (
        <li key={name}>
          <Link
            href={path}
            className={`${styles.navbar_item} ${
              pathname === path ? styles.active : ''
            }`}
            onClick={isMobile ? closeMenu : undefined}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
