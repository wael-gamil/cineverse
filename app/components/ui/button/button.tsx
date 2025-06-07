import styles from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  hide?: boolean;
  type?: 'button' | 'submit' | 'reset';
  align?: 'left' | 'right' | 'center';
  width?: '100%' | 'auto' | string;
  borderRadius?: 'smallRadius' | 'fullRadius';
};

export default function Button({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  hide = false,
  ariaLabel = 'Button',
  type = 'button',
  align = 'center',
  width = 'auto',
  borderRadius = 'smallRadius',
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        hide ? styles.hide : ''
      } ${styles[align]} ${disabled ? styles.disabled : ''} ${
        styles[borderRadius]
      } ${styles[color]}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      style={{ width }}
    >
      {children}
    </button>
  );
}
