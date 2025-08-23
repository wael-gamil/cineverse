'use client';
import styles from './contentHeroSimple.module.css';
import Image from 'next/image';
import Badge from '@/components/ui/badge/badge';
import { Icon, IconName } from '@/components/ui/icon/icon';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export type InfoCard = {
  iconName: IconName;
  title: string;
  description?: string;
  subtitle?: string;
  badges?: string[];
};

export type ContentHeroSimpleProps = {
  title: string;
  image: string;
  badges?: string[];
  infoCards?: InfoCard[];
  socialLinks?: {
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    websiteUrl?: string;
  };
  alsoKnownAs?: string[];
  bio?: string;
  actionButton?: React.ReactNode;
};

export default function ContentHeroSimple({
  title,
  image,
  badges = [],
  infoCards = [],
  socialLinks = {},
  alsoKnownAs = [],
  bio,
  actionButton,
}: ContentHeroSimpleProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = bioRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [bio]);
  return (
    <section className={styles.hero}>
      <div className={styles.rightSection}>
        <div className={styles.posterWrapper}>
          <Image
            src={image}
            alt={title}
            fill
            className={styles.posterImage}
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
        </div>
        {(socialLinks.facebookUrl ||
          socialLinks.instagramUrl ||
          socialLinks.twitterUrl ||
          socialLinks.tiktokUrl ||
          socialLinks.youtubeUrl ||
          socialLinks.websiteUrl) && (
          <div className={styles.socialIconsContainer}>
            <div className={styles.socialIcons}>
              {socialLinks.facebookUrl && (
                <Link
                  href={socialLinks.facebookUrl}
                  target='_blank'
                  aria-label='Facebook'
                >
                  <Icon
                    name='facebook'
                    strokeColor='white'
                    width={24}
                    height={24}
                  />
                </Link>
              )}
              {socialLinks.instagramUrl && (
                <Link
                  href={socialLinks.instagramUrl}
                  target='_blank'
                  aria-label='Instagram'
                >
                  <Icon
                    name='instagram'
                    strokeColor='white'
                    width={24}
                    height={24}
                  />
                </Link>
              )}
              {socialLinks.twitterUrl && (
                <Link
                  href={socialLinks.twitterUrl}
                  target='_blank'
                  aria-label='Twitter'
                >
                  <Icon
                    name='twitter'
                    strokeColor='white'
                    width={24}
                    height={24}
                  />
                </Link>
              )}
              {socialLinks.tiktokUrl && (
                <Link
                  href={socialLinks.tiktokUrl}
                  target='_blank'
                  aria-label='TikTok'
                >
                  <Icon
                    name='tiktok'
                    strokeColor='white'
                    width={24}
                    height={24}
                  />
                </Link>
              )}
              {socialLinks.youtubeUrl && (
                <Link
                  href={socialLinks.youtubeUrl}
                  target='_blank'
                  aria-label='YouTube'
                >
                  <Icon
                    name='youtube'
                    strokeColor='white'
                    width={24}
                    height={24}
                  />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.badges}>
            {badges.map(badge => (
              <Badge key={badge} text={badge} backgroundColor='bg-muted' />
            ))}
          </div>
          {actionButton && <>{actionButton}</>}
        </div>
        {bio && (
          <div className={styles.bioWrapper}>
            <div className={styles.bioSection}>
              <h2 className={styles.bioHeading}>Biography</h2>
              <p
                ref={bioRef}
                className={`${styles.bioText} ${
                  showFullBio ? styles.expanded : ''
                }`}
              >
                {bio}
              </p>
              {isOverflowing && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() => setShowFullBio(prev => !prev)}
                  style={{ minWidth: 44, minHeight: 44 }}
                  aria-label={showFullBio ? 'Show Less' : 'Read More'}
                >
                  {showFullBio ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        )}
        <div className={styles.cards}>
          {infoCards.map((card, idx) => (
            <div className={styles.card} key={idx}>
              <div className={styles.iconWrapper}>
                <Icon name={card.iconName} strokeColor='white' />
              </div>
              <div className={styles.cardText}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{card.title}</div>
                </div>
                {card.description && (
                  <div className={styles.cardDesc}>{card.description}</div>
                )}
                {card.badges && (
                  <div className={styles.cardBadges}>
                    {card.badges.map((b, i) => (
                      <Badge key={i} text={b} size='size-sm' />
                    ))}
                  </div>
                )}
                {card.subtitle && (
                  <div className={styles.cardSub}>{card.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {alsoKnownAs.length > 0 && (
          <div className={styles.akaSection}>
            <span className={styles.akaTitle}>Also Known As</span>
            <div className={styles.akaBadges}>
              {alsoKnownAs.map((aka, i) => (
                <Badge key={i} text={aka} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
