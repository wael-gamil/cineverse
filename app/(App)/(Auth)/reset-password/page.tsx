'use client';

import { useState } from 'react';
import styles from '../page.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Simulate success
      setSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Set new password</h1>
          <p className={styles.subheading}>
            Enter a strong new password for your account.
          </p>
        </div>

        {!submitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* New password */}
            <div className={styles.inputGroup}>
              <label htmlFor='password' className={styles.inputLabel}>
                New password
              </label>
              <div className={styles.inputWrapper}>
                <Icon name='lock' strokeColor='muted' width={20} height={20} />
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${
                    error ? styles.inputError : ''
                  }`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='••••••••'
                />
              </div>
            </div>

            {/* Confirm password */}
            <div className={styles.inputGroup}>
              <label htmlFor='confirmPassword' className={styles.inputLabel}>
                Confirm password
              </label>
              <div className={styles.inputWrapper}>
                <Icon name='lock' strokeColor='muted' width={20} height={20} />
                <input
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${
                    error ? styles.inputError : ''
                  }`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='••••••••'
                />
              </div>
              <Button
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                aria-label='Toggle password visibility'
                variant='ghost'
                padding='sm'
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  strokeColor='muted'
                />
              </Button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button type='submit' width='100%' disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        ) : (
          <div className={styles.form}>
            <p style={{ color: 'var(--color-muted)' }}>
              ✅ Your password has been successfully reset. You can now log in
              with your new credentials.
            </p>
            <Button width='100%'>
              <Link href='/auth/login' className={styles.registerLink}>
                Go to Login
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
