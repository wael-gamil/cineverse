'use client';

import Link from 'next/link';
import styles from './footer.module.css';
import Icon from '@/components/ui/icon/icon';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        {/* Platform Info */}
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <Icon name='film' strokeColor='white' />
            <span className={styles.logoText}>CineVerse</span>
          </div>
          <p className={styles.description}>
            Explore the universe of film and series—beautifully presented.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.container}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.navLinks}>
            {[
              { name: 'Home', path: '/' },
              { name: 'Movies', path: '/explore/movies' },
              { name: 'TV Series', path: '/explore/tv-series' },
              { name: 'Search', path: '/search' },
              { name: 'Reviews', path: '/reviews' },
              { name: 'Watchlist', path: '/watchlist' },
            ].map(({ name, path }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={styles.link}
                  aria-label={`Go to ${name}`}
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} CineVerse
      </div>
    </footer>
  );
}
