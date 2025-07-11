import styles from './badge.module.css';
import { Icon, IconName } from '../icon/icon';

export type BadgeProps = {
  iconName?: IconName;
  text?: string;
  number?: number;
  iconColor?: 'primary' | 'secondary' | 'muted' | 'white';
  color?: 'color-primary' | 'color-secondary' | 'color-muted' | 'color-white';
  numberColor?:
    | 'color-primary'
    | 'color-secondary'
    | 'color-muted'
    | 'color-white'; 
  backgroundColor?: 'bg-primary' | 'bg-secondary' | 'bg-muted' | 'bg-white'; 
  position?: 'top-left' | 'top-right'; 
  borderRadius?: 'border-md' | 'border-full';
  size?: 'size-sm' | 'size-md' | 'size-lg';
  className?: string;
  style?: React.CSSProperties;
};

export default function Badge({
  iconName,
  text,
  number,
  iconColor = 'white',
  color = 'color-white',
  numberColor = 'color-white',
  backgroundColor = 'bg-white',
  position,
  borderRadius = 'border-md',
  size = 'size-md',
  className = '',
  style,
}: BadgeProps) {
  if ((typeof number === 'number' && number > 0) || text !== undefined)
    return (
      <div
        className={`${styles.badge} ${
          position ? styles[position] : ''
        } ${className} ${styles[borderRadius]} ${styles[size]} ${
          styles[backgroundColor]
        } ${styles[color]}`}
        style={style}
      >
        {iconName && (
          <Icon name={iconName} strokeColor={iconColor} width={16} />
        )}
        {text && <span>{text}</span>}
        {number !== undefined && (
          <span className={styles[numberColor]}>{number}</span>
        )}
      </div>
    );
}
