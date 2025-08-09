'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/button/button';
import styles from './error.module.css';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>🎬</div>
          <h1 className={styles.heading}>Oops! Something went wrong</h1>
          <p className={styles.description}>
            We encountered an error while loading this content. Don't worry, our
            team has been notified.
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.buttonGroup}>
            <Button onClick={reset} size='lg' width='100%'>
              Try Again
            </Button>
            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
              size='lg'
              width='100%'
            >
              Go Home
            </Button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className={styles.errorDetails}>
            <details>
              <summary className={styles.errorSummary}>
                Error Details (Development)
              </summary>
              <pre className={styles.errorPre}>
                {error.message}
                {error.stack}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
