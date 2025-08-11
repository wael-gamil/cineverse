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

  return (
    <html>
      <head>
        <title>Error - CineVerse</title>
        <meta name="description" content="An unexpected error occurred while loading the page. Our team has been notified and is working to resolve the issue. Please try again later or return to the homepage." />
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
        <meta property="og:title" content="Error | CineVerse" />
        <meta property="og:description" content="An unexpected error occurred while loading the page. Please try again or return to the homepage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cineverse-xi.vercel.app" />
        <meta property="og:site_name" content="CineVerse" />
        <meta property="og:image" content="https://cineverse-xi.vercel.app/og-logo.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Error | CineVerse" />
        <meta name="twitter:description" content="An unexpected error occurred. Please try again or return to the homepage." />
        <meta name="twitter:image" content="https://cineverse-xi.vercel.app/og-logo.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
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
