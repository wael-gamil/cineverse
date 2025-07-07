'use client';

import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './card.module.css';
import { Icon, IconName } from '../../ui/icon/icon';
import Button from '../../ui/button/button';
import Badge from '../../ui/badge/badge';
import fallbackImage from '@/public/avatar_fallback.png';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type BadgeType = {
  iconName?: IconName;
  text?: string;
  number?: number;
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  position?: 'top-left' | 'top-right';
};

type LayoutType = 'overlay' | 'below' | 'wide';

export type CardProps = {
  imageUrl?: string | StaticImageData;
  imageHeight?: 'image-lg' | 'image-md';
  title: string;
  subtitle?: string;
  description?: string;
  badges?: BadgeType[];
  onClick?: () => void;
  href?: string;
  layout?: LayoutType;
  children?: React.ReactNode;
  additionalButton?: {
    iconName?: IconName;
    onClick: () => void;
  };
  highlight?: boolean;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
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
  className = '',
  minWidth,
  maxWidth,
}: CardProps) {
  const router = useRouter();
  // const isMobile = useIsMobile();
  const [hasError, setHasError] = useState(false);
  const isMobile = useResponsiveLayout();
  const imageToUse = hasError || imageUrl === null ? fallbackImage : imageUrl;

  const computedStyle = {
    minWidth:
      typeof minWidth === 'number'
        ? isMobile
          ? `250px`
          : `${minWidth}px`
        : undefined,
    maxWidth:
      typeof maxWidth === 'number'
        ? isMobile
          ? `250px`
          : `${maxWidth}px`
        : undefined,
  };

  const handleClick = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  const renderBadges = () =>
    badges.map((badge, i) => (
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
    ));

  const renderImage = () => (
    <div className={`${styles.imageWrapper} ${styles[imageHeight]}`}>
      <Image
        src={imageToUse}
        alt={title}
        fill
        onError={() => setHasError(true)}
        className={styles.posterImage}
        sizes='(max-width: 768px) 100vw, 400px'
      />
      {renderBadges()}
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
    </div>
  );

  const renderOverlayLayout = () => (
    <>
      {renderImage()}
      <>
        <div className={styles.gradientOverlay} />
        <div className={styles.bottomTitle}>
          <h3>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
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
      </>
    </>
  );

  const renderBelowLayout = () => (
    <>
      {renderImage()}
      <div className={styles.belowDetails}>
        <h3 className={styles.contentTitle}>{title}</h3>

        {subtitle && <p className={styles.contentBelowOverview}>{subtitle}</p>}
        {description && <p className={styles.contentOverview}>{description}</p>}
        {/* {children} */}
      </div>
    </>
  );

  const renderWideLayout = () => (
    <div className={styles.wideLayout}>
      <div className={styles.wideImage}>
        <Image
          src={imageToUse}
          alt={title}
          fill
          onError={() => setHasError(true)}
          className={styles.posterImage}
          sizes='(max-width: 768px) 100vw, 400px'
        />
      </div>
      <div className={styles.wideDetails}>
        <h3 className={styles.contentTitle}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {description && (
          <p className={styles.contentBelowOverview}>{description}</p>
        )}
        {children}
      </div>
    </div>
  );

  const getLayout = () => {
    if (layout === 'below' || isMobile) return renderBelowLayout();
    if (layout === 'wide') return renderWideLayout();
    return renderOverlayLayout();
  };

  return (
    <div
      className={`${styles.cardWrapper} ${
        highlight ? styles.highlight : ''
      } ${className}`}
      style={computedStyle}
      onClick={handleClick}
    >
      {getLayout()}
    </div>
  );
}
