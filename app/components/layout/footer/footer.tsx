import styles from '@/app/components/layout/footer/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__branding}>
          <h2 className={styles.footer__title}>MovieVerse</h2>
          <p className={styles.footer__description}>
            Discover the universe of movies and TV series. Your one-stop
            destination for all things entertainment.
          </p>
        </div>
        <div className={styles.footer__links}>
          <div className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Quick Links</h3>
            <ul className={styles.footer__list}>
              <li>
                <a href='#' className={styles.footer__link}>
                  Movies
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  TV Series
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  Top Rated
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  Coming Soon
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Legal</h3>
            <ul className={styles.footer__list}>
              <li>
                <a href='#' className={styles.footer__link}>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='#' className={styles.footer__link}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footer__copyright}>
          <p>© 2025 MovieVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
