import styles from './page.module.css';
import { Icon } from '@/components/ui/icon/icon';

export default async function ContentListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.container}>{children}</main>;
}
