import styles from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'neutral' | 'danger';
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  hide?: boolean;
  type?: 'button' | 'submit' | 'reset';
  align?: 'left' | 'right' | 'center';
  width?: '100%' | 'auto' | string;
  borderRadius?: 'smallRadius' | 'fullRadius';
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export default function Button({
  children,
  variant = 'solid',
  color = 'primary',
  onClick,
  disabled = false,
  hide = false,
  ariaLabel = 'Button',
  type = 'button',
  align = 'center',
  width = 'auto',
  borderRadius = 'smallRadius',
  padding = 'md',
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        hide ? styles.hide : ''
      } ${styles[align]} ${disabled ? styles.disabled : ''} ${
        styles[borderRadius]
      } ${styles[color]} ${styles[padding]}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      style={{ width }}
    >
      {children}
    </button>
  );
}
