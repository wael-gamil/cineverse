'use client';
import { useState } from 'react';
import styles from './panelWrapper.module.css';
import Button from '../button/button';

type PanelWrapperProps = {
  label: string;
  icon?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  badge?: string | number;
  children: React.ReactNode;
  initialOpen?: boolean;
  ariaLabel?: string;
  position?: 'left' | 'right';
  width?: 'full' | '';
  solidPanel?: boolean;
  padding?: 'lg' | 'md' | 'sm';
};

export default function PanelWrapper({
  label,
  icon,
  badge,
  children,
  initialOpen = false,
  ariaLabel,
  position = 'left',
  width = '',
  solidPanel = false,
  padding = 'md',
}: PanelWrapperProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={styles.wrapper}>
      <Button
        variant='solid'
        color='neutral'
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={ariaLabel || `Toggle ${label}`}
        align={position}
      >
        <span
          className={`${styles.iconWrapper} ${isOpen ? styles.rotate : ''}`}
        >
          {typeof icon === 'function' ? icon(isOpen) : icon}
        </span>
        {label}
        {badge !== undefined && <span className={styles.badge}>{badge}</span>}
      </Button>

      {isOpen && (
        <div
          className={`${styles.panel} ${styles[position]} ${styles[width]} ${
            solidPanel ? styles.solid : styles.transparent
          } ${styles[padding]}`}
          role='region'
          aria-label={`${label} Panel`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
