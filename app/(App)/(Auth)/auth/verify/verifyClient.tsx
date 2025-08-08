'use client';

import styles from '../../page.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import Button from '@/components/ui/button/button'; // reuse your styled button
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { redirectIfAuthenticated } = useAuth();
  useEffect(() => {
    const redirectTo = searchParams.get('redirect') || '/';
    redirectIfAuthenticated(redirectTo);
  }, [redirectIfAuthenticated, searchParams]);

  const {
    data: message,
    isLoading,
    isError,
    error,
  } = useEmailVerification(token);

  // Optional auto redirect after success
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Email Verification</h1>

        {isLoading && (
          <p className={styles.subheading}>Verifying your email...</p>
        )}

        {isError && (
          <div className={styles.error}>
            <p>{(error as Error).message}</p>
          </div>
        )}

        {message && (
          <>
            <div className={styles.success}>
              <p>{message}</p>
            </div>
            <p className={styles.subheading}>
              Redirecting you to login page...
            </p>
            <Button onClick={() => router.push('/login')} width='100%'>
              Go to Login Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
