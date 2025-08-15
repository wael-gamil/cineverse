import styles from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'list';
  color?: 'primary' | 'secondary' | 'neutral' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  hide?: boolean;
  type?: 'button' | 'submit' | 'reset';
  align?: 'left' | 'right' | 'center';
  width?: '100%' | 'auto' | string;
  borderRadius?: 'smallRadius' | 'fullRadius';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  active?: boolean;
  style?: React.CSSProperties;
  title?: string;
};

export default function Button({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  hide = false,
  ariaLabel = 'Button',
  type = 'button',
  align = 'center',
  width = 'auto',
  borderRadius = 'smallRadius',
  padding = 'md',
  active = false,
  style,
  title,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        hide ? styles.hide : ''
      } ${styles[align]} ${disabled ? styles.disabled : ''} ${
        styles[borderRadius]
      } ${styles[color]} ${styles[padding]} ${active ? styles.active : ''} ${
        styles[`size-${size}`]
      }`}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      style={{ width, ...style }}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
