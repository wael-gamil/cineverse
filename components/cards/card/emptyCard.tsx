import Icon from '@/components/ui/icon/icon';
import styles from './emptyCard.module.css';

type EmptyCardProps = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: 'image-md' | 'image-lg';
};

export default function EmptyCard({
  minWidth,
  maxWidth,
  minHeight = 'image-md',
}: EmptyCardProps) {
  const computedStyle = {
    minWidth: minWidth ? `${minWidth}px` : undefined,
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    minHeight: minHeight === 'image-md' ? '320px' : '400px',
  };

  return (
    <div className={styles.emptyCard} style={computedStyle}>
      <Icon name='film' strokeColor='white' />
      <p>No content available.</p>
    </div>
  );
}
