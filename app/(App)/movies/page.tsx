import styles from './page.module.css';
export default function Movies() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎬 Movies</h1>
        <p>
          Explore and filter the latest and greatest films from around the
          world.
        </p>
      </header>

      <section className={styles.controls}>
        <div className={styles.filter}>Filter</div>
        <div className={styles.sort}>Sort</div>
      </section>

      <section className={styles.movieList}>
        
      </section>

      <footer className={styles.pagination}>
        <span>Pagination</span>
      </footer>
    </div>
  );
}
