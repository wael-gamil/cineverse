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
import Link from 'next/link';

type BadgeType = {
  iconName?: IconName;
  text?: string;
  number?: number;
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  position?: 'top-left' | 'top-right';
};

type ActionButtonType = {
  iconName: IconName;
  onClick: (e: React.MouseEvent) => void;
  color?: 'primary' | 'secondary' | 'danger' | 'neutral';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  ariaLabel?: string;
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
  actionButtons?: ActionButtonType[];
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
  actionButtons = [],
  highlight,
  className = '',
  minWidth,
  maxWidth,
}: CardProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const isMobile = useResponsiveLayout();
  const imageToUse = hasError || imageUrl === null ? fallbackImage : imageUrl;
  const computedStyle = {
    minWidth:
      typeof minWidth === 'number'
        ? isMobile
          ? `200px`
          : `${minWidth}px`
        : undefined,
    maxWidth:
      typeof maxWidth === 'number'
        ? isMobile
          ? `400px`
          : `${maxWidth}px`
        : undefined,
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Left click only
    if (e.button === 0) {
      if (onClick) onClick();
      else if (href) router.push(href);
    }
  };

  const Wrapper = href ? Link : 'div';

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

  const renderActionButtons = () =>
    actionButtons.map((button, i) => {
      // Adjust position if info button exists and action button is in same area
      let positionClass = button.position || 'top-right';
      if (additionalButton && button.position === 'top-right') {
        // If there's an info button in top-right, offset the action button
        positionClass = 'top-right';
      }
      return (
        <div
          key={i}
          className={`${styles.actionButton} ${styles[positionClass]}`}
          title={button.ariaLabel || 'action'}
        >
          {' '}
          <Button
            borderRadius='fullRadius'
            variant='solid'
            color={button.color === 'danger' ? 'danger' : 'primary'}
            ariaLabel={button.ariaLabel || 'action'}
            padding='none'
            onClick={button.onClick}
            title={button.ariaLabel || 'action'}
          >
            <Icon name={button.iconName} strokeColor='white' />
          </Button>
        </div>
      );
    });
  const renderImage = (includeActionButtons = false, isBelow = false) => (
    <div
      className={`${styles.imageWrapper} ${styles[imageHeight]} ${
        isBelow ? styles.belowImage : ''
      }`}
    >
      <Image
        src={imageToUse}
        alt={title}
        fill
        onError={() => setHasError(true)}
        className={styles.posterImage}
        sizes='(max-width: 768px) 100vw, 400px'
      />
      {renderBadges()}
      {additionalButton && (
        <div className={styles.infoButtonWrapper} title='More info'>
          <Button
            borderRadius='fullRadius'
            variant='ghost'
            color='neutral'
            ariaLabel='show more info'
            title='More info'
            padding='none'
            onClick={additionalButton?.onClick}
          >
            <Icon
              name={additionalButton?.iconName || 'info'}
              strokeColor='white'
            />
          </Button>
        </div>
      )}
      {/* Render action buttons inside image wrapper for below layout */}
      {includeActionButtons &&
        actionButtons.map((button, i) => {
          const positionClass = button.position || 'top-right';
          return (
            <div
              key={i}
              className={`${styles.actionButton} ${styles[positionClass]}`}
              title={button.ariaLabel || 'action'}
            >
              <Button
                borderRadius='fullRadius'
                variant='solid'
                color={button.color === 'danger' ? 'danger' : 'primary'}
                ariaLabel={button.ariaLabel || 'action'}
                padding='none'
                onClick={button.onClick}
                title={button.ariaLabel || 'action'}
              >
                <Icon name={button.iconName} strokeColor='white' />
              </Button>
            </div>
          );
        })}
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
          {renderActionButtons()}
          <div className={styles.infoButtonWrapper} title='More info'>
            <Button
              borderRadius='fullRadius'
              variant='ghost'
              color='neutral'
              ariaLabel='show more info'
              title='More info'
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
      {renderImage(true, true)}{' '}
      {/* Pass true to include action buttons in image */}
      <div className={styles.belowDetails}>
        <h3 className={styles.contentTitle}>{title}</h3>

        {subtitle && <p className={styles.contentBelowOverview}>{subtitle}</p>}
        {description && (
          <p className={styles.contentBelowOverview}>{description}</p>
        )}
        {children}
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

  return href ? (
    <Link
      href={href}
      draggable
      target='_self'
      rel='noopener noreferrer'
      className={`${styles.cardWrapper} ${
        highlight ? styles.highlight : ''
      } ${className}`}
      style={computedStyle}
    >
      {getLayout()}
    </Link>
  ) : (
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
