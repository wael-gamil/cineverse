'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './panelWrapper.module.css';
import Button from '../button/button';
import Badge from '../badge/badge';
type PanelWrapperProps = {
  label: string;
  icon?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  badge?: string | number;
  children: React.ReactNode;
  setClose?: (closer: () => void) => void;
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
  setClose,
  ariaLabel,
  position = 'left',
  width = '',
  solidPanel = false,
  padding = 'md',
}: PanelWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    if (setClose) {
      setClose(() => () => setIsOpen(false));
    }
  }, [setClose]);
  return (
    <div className={styles.wrapper} ref={panelRef}>
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
        {/* {badge !== undefined && <span className={styles.badge}>{badge}</span>} */}
        {badge !== undefined && (
          <Badge
            text={badge.toString()}
            backgroundColor='bg-primary'
            borderRadius='border-full'
          />
        )}
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
