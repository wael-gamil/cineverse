'use client';

import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './card.module.css';
import useIsMobile from '@/app/hooks/useIsMobile';
import { Icon, IconName } from '../../ui/icon/icon';
import Button from '../../ui/button/button';
import Badge from '../../ui/badge/badge';
import fallbackImage from '@/public/avatar_fallback.png';

type Badge = {
  iconName?: IconName;
  text?: string;
  number?: number;
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  position?: 'top-left' | 'top-right';
};

type CardProps = {
  imageUrl?: string | StaticImageData;
  imageHeight?: 'image-lg' | 'image-md';
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Badge[];
  onClick?: () => void;
  href?: string;
  layout?: 'overlay' | 'below';
  children?: React.ReactNode;
  additionalButton?: {
    iconName?: IconName;
    onClick: () => void;
  };
  highlight?: boolean;
};

export default function Card({
  imageUrl = fallbackImage,
  imageHeight = 'image-lg',
  title,
  subtitle,
  description,
  badges = [],
  onClick,
  href,
  layout = 'overlay',
  children,
  additionalButton,
  highlight,
}: CardProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  const imageToUse = hasError ? fallbackImage : imageUrl;

  return (
    <div
      className={`${styles.cardWrapper} ${highlight ? styles.highlight : ''}`}
      onClick={handleClick}
    >
      <div className={`${styles.imageWrapper} ${styles[imageHeight]}`}>
        <Image
          src={imageToUse}
          alt={title}
          fill
          onError={() => setHasError(true)}
          className={styles.posterImage}
          sizes='(max-width: 768px) 100vw, 400px'
        />
        {layout === 'overlay' && !isMobile && (
          <div className={styles.bottomTitle}>
            <h3>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        {layout === 'overlay' && !isMobile && (
          <div className={styles.gradientOverlay} />
        )}

        {layout === 'overlay' && !isMobile && (
          <div className={styles.hoverOverlay}>
            <div className={styles.infoButtonWrapper}>
              <Button
                borderRadius='fullRadius'
                variant='ghost'
                color='neutral'
                ariaLabel='show more info'
                padding='none'
                onClick={additionalButton?.onClick}
              >
                <Icon
                  name={additionalButton?.iconName || 'info'}
                  strokeColor='white'
                />
              </Button>
            </div>
            <div className={styles.contentDetails}>
              <h3 className={styles.contentTitle}>{title}</h3>
              {description && (
                <p className={styles.contentOverview}>{description}</p>
              )}
              {children}
            </div>
          </div>
        )}

        {badges.map((badge, i) => (
          <Badge
            key={i}
            iconName={badge.iconName}
            text={badge.text}
            number={badge.number}
            iconColor={badge.color || 'white'}
            backgroundColor='bg-muted'
            borderRadius='border-full'
            position={badge.position}
            className={styles.badge}
          />
        ))}
      </div>

      {(layout === 'below' || isMobile) && (
        <div className={styles.belowDetails}>
          <h3 className={styles.contentTitle}>{title}</h3>
          {description && (
            <p className={styles.contentBelowOverview}>{description}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
