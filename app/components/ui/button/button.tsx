import styles from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  hide?: boolean;
  type?: 'button' | 'submit' | 'reset';
  align?: 'left' | 'right' | 'center';
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  hide = false,
  ariaLabel = 'Button',
  type = 'button',
  align = 'center',
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        hide ? styles.hide : ''
      } ${styles[align]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
}
