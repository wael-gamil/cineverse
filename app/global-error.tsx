'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/button/button';
import styles from './global-error.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>🎬</div>
              <h1 className={styles.heading}>Something went wrong!</h1>
              <p className={styles.description}>
                We apologize for the inconvenience. An unexpected error occurred
                while loading the page.
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
      </body>
    </html>
  );
}
