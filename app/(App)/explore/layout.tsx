import styles from './page.module.css';

export default async function ContentListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.container}>{children}</main>;
}
