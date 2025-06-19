'use client';

import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './card.module.css';
import useIsMobile from '@/app/hooks/useIsMobile';
import { Icon, IconName } from '../ui/icon/icon';
import Button from '../ui/button/button';
import Badge from '../ui/badge/badge';
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
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Badge[];
  onClick?: () => void;
  href?: string;
  layout?: 'overlay' | 'below';
  children?: React.ReactNode;
};

export default function Card({
  imageUrl = fallbackImage,
  title,
  description,
  badges = [],
  onClick,
  href,
  layout = 'overlay',
  children,
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
    <div className={styles.cardWrapper} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageToUse}
          alt={title}
          fill
          onError={() => setHasError(true)}
          className={styles.posterImage}
          sizes='(max-width: 768px) 100vw, 400px'
        />
        {layout === 'overlay' && <div className={styles.gradientOverlay} />}

        {layout === 'overlay' && !isMobile && (
          <div className={styles.hoverOverlay}>
            <div className={styles.infoButtonWrapper}>
              <Button
                borderRadius='fullRadius'
                variant='ghost'
                color='neutral'
                ariaLabel='show more info'
              >
                <Icon name='info' strokeColor='white' />
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
            color={badge.color || 'white'}
            position={badge.position}
            className={styles.badge}
          />
        ))}
      </div>

      {(layout === 'below' || isMobile) && (
        <div className={styles.belowDetails}>
          <h3 className={styles.contentTitle}>{title}</h3>
          {description && (
            <p className={styles.contentOverview}>{description}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
