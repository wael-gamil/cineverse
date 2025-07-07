'use client';
import React from 'react';
import styles from './sectionHeader.module.css';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'block' | 'strip' | 'lined' | 'ghost';
  filterTabs?: React.ReactNode;
};

export default function SectionHeader({
  title,
  subtitle,
  icon,
  variant = 'block',
  filterTabs,
}: Props) {
  const isMobile = useResponsiveLayout();
  return (
    <div
      className={`${styles.header} ${
        variant === 'strip' && isMobile ? styles.block : styles[variant]
      }`}
    >
      <div className={styles.left}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {filterTabs && <div className={styles.filters}>{filterTabs}</div>}
    </div>
  );
}
