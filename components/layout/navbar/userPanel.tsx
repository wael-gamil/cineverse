'use client';
import styles from './navbar.module.css';
import Image from 'next/image';
import { useStore } from '@tanstack/react-store';
import { userStore } from '@/utils/userStore';
import { logout } from '@/utils/logout';
import Button from '@/components/ui/button/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import fallBackAvatar from '@/public/avatar_fallback.png';

type Props = {
  closePanel?: () => void;
};

export default function UserPanel({ closePanel }: Props) {
  const { username, email, profilePicture } = useStore(userStore);
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
            src={profilePicture || fallBackAvatar}
            alt='User Avatar'
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
        </div>
        <div className={styles.userInfoText}>
          <h4>{username}</h4>
          <p>{email}</p>
        </div>
      </div>

      <div className={styles.userActions}>
        <Link href='/profile'>
          <Button 
            variant='list' 
            width='100%' 
            onClick={(e) => {
              e.preventDefault();
              closePanel?.();
                router.push('/profile');
             
            }}
          >
            View Profile
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
