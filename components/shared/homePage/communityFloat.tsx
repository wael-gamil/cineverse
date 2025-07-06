'use client';

import Icon from '@/components/ui/icon/icon';
import styles from './communityFloat.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button/button';

export default function CommunityFloat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.contentGrid}>
        <div className={styles.content}>
          <div className={styles.textHeader}>
            <h3 className={styles.heading}>Join CineVerse</h3>
            <p className={styles.subtext}>
              Build your watchlist, write reviews, and connect with fellow movie
              enthusiasts.
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statBox}>
              <Icon name='user' strokeColor='white' />
              <span className={styles.statNumber}>2.5M+</span>
              <p className={styles.statLabel}>Members</p>
            </div>
            <div className={styles.statBox}>
              <Icon name='MessageSquare' strokeColor='success' />
              <span className={styles.statNumber}>1.8M+</span>
              <p className={styles.statLabel}>Reviews</p>
            </div>
          </div>
          <div className={styles.cta}>
            <Button>
              <Link href='/' className={styles.link}>
                <Icon name='user' strokeColor='white' />
                Sign Up Free
              </Link>
            </Button>
            <Button variant='outline'>
              <Link href='/' className={styles.link}>
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.profileBox}>
            <div className={styles.avatar}>WG</div>
            <div>
              <h4 className={styles.profileName}>Wael Gamil</h4>
              <p className={styles.profileRole}>Movie Enthusiast</p>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div>
              <span className={styles.profileNumber}>247</span>
              <span className={styles.profileLabel}>Watched</span>
            </div>
            <div>
              <span className={styles.profileNumber}>89</span>
              <span className={styles.profileLabel}>Reviews</span>
            </div>
            <div>
              <span className={styles.profileNumber}>156</span>
              <span className={styles.profileLabel}>Watchlist</span>
            </div>
          </div>
          <div className={styles.activity}>
            <div className={styles.activityItem}>
              <Icon name='starFilled' strokeColor='secondary' />
              Rated "Dune: Part Two" 5★
            </div>
            <div className={styles.activityItem}>
              <Icon name='bookmark' strokeColor='white' />
              Added "Oppenheimer" to watchlist
            </div>
          </div>
        </div>
      </div>
      <div className={styles.glowEffect} />
    </div>
  );
}
