/**
 * Test utility component to demonstrate different not-found scenarios
 * This is for development/testing purposes only
 */
'use client';

import Link from 'next/link';
import styles from '@/components/shared/notFound/notFound.module.css';

const testUrls = [
  { url: '/invalid-page', description: 'Global 404 - Invalid page' },
  {
    url: '/spiderman-invalid',
    description: 'Content not found - Invalid movie slug',
  },
  {
    url: '/profile/invaliduser123',
    description: 'User not found - Invalid username',
  },
  {
    url: '/the-office/seasons/99',
    description: 'Season not found - Invalid season number',
  },
  {
    url: '/the-office/seasons/1/episodes/999',
    description: 'Episode not found - Invalid episode number',
  },
  { url: '/crew/999999', description: 'Person not found - Invalid crew ID' },
  {
    url: '/explore/invalid-type',
    description: 'Explore not found - Invalid content type',
  },
];

export default function NotFoundTestPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>CineVerse Not-Found System Test</h1>
          <p className={styles.subheading}>
            Click on any link below to test different not-found scenarios
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>Test Cases:</h3>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {testUrls.map((test, index) => (
                <li key={index}>
                  <Link
                    href={test.url}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-surface-60)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-primary-20)',
                      textDecoration: 'none',
                      color: 'var(--color-white)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor =
                        'var(--color-primary)';
                      e.currentTarget.style.backgroundColor =
                        'var(--color-primary-20)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor =
                        'var(--color-primary-20)';
                      e.currentTarget.style.backgroundColor =
                        'var(--color-surface-60)';
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {test.description}
                    </div>
                    <div
                      style={{
                        color: 'var(--color-muted)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      {test.url}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            color: 'var(--color-muted)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          ⚠️ This page is for testing purposes only. Remove it in production.
        </div>
      </div>
    </div>
  );
}
