'use client';

import { useEffect } from 'react';
import styles from '../../page.module.css';
import Icon from '@/components/ui/icon/icon';

export default function GoogleOAuthSuccessClient() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token && window.opener) {
      window.opener.postMessage(
        { type: 'OAUTH_TOKEN', token },
        window.location.origin
      );
      setTimeout(() => window.close(), 500);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>        <div className={styles.header}>
          <h1 className={styles.heading}>Google Sign-In</h1>
          <p className={styles.subheading}>
            Finishing your login, please wait...
          </p>
        </div>

        <div className={styles.success}>
          <Icon
            name='trust-badge'
            strokeColor='success'
            width={20}
            height={20}
          />
          Google login was successful. This window will close shortly.
        </div>
      </div>
    </div>
  );
}
