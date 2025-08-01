'use client';
import styles from './navbar.module.css';
import Image from 'next/image';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { logout } from '@/utils/logout';
import Button from '@/components/ui/button/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  closePanel?: () => void;
};

export default function UserPanel({ closePanel }: Props) {
  const { username, email } = useStore(userStore);
  const router = useRouter();

  const handleLogout = () => {
    logout(router);
    closePanel?.();
  };
  return (
    <div className={styles.userPanelContainer}>
      <div className={styles.profileSection}>
        <div className={styles.avatarWrapper}>
          <Image
            src='https://image.tmdb.org/t/p/w500/zpIK3GYmqDPumneEDf0aqsqxhV1.jpg'
            alt='User Avatar'
            fill
          />
        </div>
        <div className={styles.userInfoText}>
          <h4>{username}</h4>
          <p>{email}</p>
        </div>
      </div>

      <div className={styles.userActions}>
        <Link href='/profile'>
          <Button variant='list' width='100%' onClick={closePanel}>
            View Profile
          </Button>
        </Link>
        <Link href='/watchlist'>
          <Button variant='list' width='100%' onClick={closePanel}>
            My Watchlist
          </Button>
        </Link>
        <Button
          variant='list'
          color='danger'
          onClick={handleLogout}
          width='100%'
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
