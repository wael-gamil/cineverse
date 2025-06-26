import styles from './page.module.css';
import { Icon } from '@/components/ui/icon/icon';

export default async function ContentListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.container}>
      <header className={styles.heroSection}>
        {/* Icon and Badge */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackground}></div>
          <div className={styles.iconForeground}>
            <Icon name='film' strokeColor='primary' width={32} height={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.heroTitle}>
          <span className={styles.titleCine}>Cine</span>
          <span className={styles.titleVerse}>Verse</span>
        </h1>

        {/* Subtitle */}
        <div className={styles.heroSubtitleWrapper}>
          <div className={styles.subtitleLine}></div>
          <p className={styles.heroSubtitle}>Discover Movies & Series</p>
          <div className={styles.subtitleLine}></div>
        </div>

        {/* Description */}
        <p className={styles.heroDescription}>
          Explore a growing universe of cinema, from trending hits to timeless
          classics. Immerse yourself in stories that captivate, inspire, and
          entertain.
        </p>

        {/* Stats */}
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statDot}></span>
            <span>10,000+ Titles</span>
          </div>
          <div className={styles.statItem}>
            <Icon name='sparkles' strokeColor='secondary' width={16} />
            <span>Premium Quality</span>
          </div>
          <div className={styles.statItem}>
            <Icon name='trending-up' strokeColor='success' width={16} />
            <span>Updated Daily</span>
          </div>
        </div>
      </header>
      {/* Divider */}
      <div className={styles.DividerWrapper}>
        <div className={styles.Divider}></div>
      </div>
      {children}
    </main>
  );
}
