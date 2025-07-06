import Icon from '@/components/ui/icon/icon';
import styles from './emptyCard.module.css';
export default function EmptyCard() {
  return (
    <div className={styles.emptyCard}>
      <Icon name='film' strokeColor='white' />
      <p>No content available.</p>
    </div>
  );
}
