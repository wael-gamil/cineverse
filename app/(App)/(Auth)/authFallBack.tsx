import styles from './authFallback.module.css';

export default function AuthFallback() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonSubtitle} />
        </div>
        <div className={styles.skeletonButton} />
      </div>
    </div>
  );
}
