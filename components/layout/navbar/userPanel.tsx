'use client';
import styles from './navbar.module.css';
import Image from 'next/image';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { logout } from '@/utils/logout';
import Button from '@/components/ui/button/button';
import Link from 'next/link';
type Props = {
  closePanel?: () => void;
};
export default function UserPanel({ closePanel }: Props) {
  const { username, email } = useStore(userStore);
  return (
    <div className={styles.panelContainer}>
      <div className={styles.profileSection}>
        <div className={styles.avatarWrapper}>
          <Image
            src='https://image.tmdb.org/t/p/w500/zpIK3GYmqDPumneEDf0aqsqxhV1.jpg'
            alt='User Avatar'
            fill
          />
        </div>
        <div className={styles.userInfoText}>
          <h3>{username}</h3>
          <p>{email}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant='ghost' width='100%' onClick={closePanel}>
          <Link href='/profile'>View Profile</Link>
        </Button>
        <Button
          variant='ghost'
          color='danger'
          onClick={() => {
            logout();
            closePanel?.();
          }}
          width='100%'
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
