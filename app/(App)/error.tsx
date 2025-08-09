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
    // Update document title for error page
    const originalTitle = document.title;
    document.title = 'Error - CineVerse';

    // Update meta description if it exists
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const originalDescription = descriptionMeta?.getAttribute('content');

    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'An unexpected error occurred while loading the page. Our team has been notified and is working to resolve the issue.'
      );
    }

    console.error('App error:', error);

    // Cleanup function to restore original values
    return () => {
      document.title = originalTitle;
      if (descriptionMeta && originalDescription) {
        descriptionMeta.setAttribute('content', originalDescription);
      }
    };
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
