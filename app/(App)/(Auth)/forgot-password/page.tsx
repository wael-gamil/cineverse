'use client';

import { useState } from 'react';
import styles from '../page.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate sending email
    setTimeout(() => {
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
      } else {
        setSubmitted(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Reset your password</h1>
          <p className={styles.subheading}>
            Enter the email associated with your account.
          </p>
        </div>

        {!submitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor='email' className={styles.inputLabel}>
                Email address
              </label>
              <div className={styles.inputWrapper}>
                <Icon
                  name='envelope'
                  strokeColor='muted'
                  width={20}
                  height={20}
                />
                <input
                  id='email'
                  type='email'
                  className={`${styles.input} ${
                    error ? styles.inputError : ''
                  }`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com'
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <Button type='submit' width='100%' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        ) : (
          <div className={styles.form}>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
              ✅ A password reset link has been sent to <strong>{email}</strong>
              . Please check your inbox.
            </p>
          </div>
        )}

        <div className={styles.divider}>
          <span>Back to login?</span>
        </div>

        <Button width='100%' variant='outline'>
          <Link href='/auth/login' className={styles.registerLink}>
            Sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
