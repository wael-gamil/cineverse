// components/ui/badge/Badge.tsx
import styles from './badge.module.css';
import { Icon, IconName } from '../icon/icon';

export type BadgeProps = {
  iconName?: IconName;
  text?: string;
  number?: number;
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  position?: 'top-left' | 'top-right'; // optional for absolutely positioned badges
  className?: string;
  style?: React.CSSProperties;
};

export default function Badge({
  iconName,
  text,
  number,
  color = 'white',
  position,
  className = '',
  style,
}: BadgeProps) {
  return (
    <div
      className={`${styles.badge} ${
        position ? styles[position] : ''
      } ${className}`}
      style={style}
    >
      {iconName && <Icon name={iconName} strokeColor={color} width={16} />}
      {text && <span>{text}</span>}
      {number !== undefined && <span>{number.toFixed(1)}</span>}
    </div>
  );
}
